import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ApiProvider} from "../../../../providers/api/api";
import * as _ from 'lodash';
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AuthProvider} from "../../../../providers/auth/auth";

@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.scss']
})
export class AddGroupComponent implements OnInit {
  show = false;
  show_spinnner = false;
  show_loading = false;
  show_group = true;
  show_employee = true;
  show_direction = true;
  show_entity = true;
  public message_toast = "";
  public success_title = "";
  closeResult = '';
  public show_bread = true;
  public employees:any = [];
  public members:any = [];
  public old_members:any = [];
  public name = "";
  public description = "";
  public owner = "";
  public search_text = "";
  public title = "Nouveau groupe";
  private group:any;
  private user:any;
  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private auth: AuthProvider,
    private api:ApiProvider
  ) {
    const id:any = this.route.snapshot.paramMap.get('id');
    router.events.subscribe((val:any) => {
      // see also
      if(val.url =='/inside/group/edit' || val.url =='/inside/group/edit/'+id){
        this.show_bread = false;
      }
    });
    if(id !== undefined && id != null){
      this.title = "Modification";
      this.show_spinnner = true;
    }
    this.auth.getContext().then((d:any)=>{
      this.user = d;
    }, (e:any)=>{
    });

    this.getEmployees();
    this.group = {
      members :[]
    };

  }

  ngOnInit(): void {

  }

  saveGroup(){
    if(!this.show_bread){
      this.owner = this.user.employee.id;
    }
    if(this.checkForm()) {
      this.show_loading = true;
      if(this.group.body !== undefined && this.group.body !== null){
        this.group.id = this.group.body.id;
        this.group.name = this.name;
        this.group.description = this.description;
        //this.group.entity_id = this.des;
        this.group.put().subscribe((d:any)=>{
          // traitement du proprietaire
          const owner = _.find(this.group.body.members, {profile:'owner'});
          if(owner.employee.id != parseInt(this.owner)){
            // Gestion de l'ancien proprio
            this.api.Members.get(owner.id).subscribe((ow:any)=>{
              ow.id = ow.body.id;
              if(_.find(this.employees,{id:owner.employee.id}).check){
                // l'ancien proprietaire devient membre
                ow.profile = "member";
                ow.put();
              } else {
                // l'ancien proprietaire doit être enleve du groupe
                ow.remove();
              }
            });
            const me = _.find(this.group.body.members,{employee_id:parseInt(this.owner)});
            if(me != undefined){
              // le nouveau proprio est actuellement un membre
              this.api.Members.get(me.id).subscribe((ow:any)=>{
                ow.id = ow.body.id;
                ow.profile = "owner";
                ow.put();
              })
            } else {
              // il faut le creer
              this.api.Members.post({profile:'owner', group_id:this.group.body.id, employee_id:this.owner});
              console.log("owner créé");
            }

          } else {

          }
          // traitement des membres
          this.employees.forEach((v:any)=>{
            // ajout
            if(v.check){
              // verification si l'utilisateur n'est pas déjà membre
              if(_.find(this.group.body.members,{employee_id:v.id})== undefined) {
                this.api.Members.post({profile:'member', group_id:d.body.id, employee_id:v.id}).subscribe(()=>{
                  //console.log("membre", v.id, 'créé');
                }, (e:any)=>{
                  console.log(e);
                })
              }

            } else {
              // suppremssion
              const x = _.find(this.group.body.members,{employee_id:v.id});
              if(x!=undefined && x.profile !='owner'){
                this.api.Members.get(x.id).subscribe((a:any)=>{
                  a.id = a.body.id;
                  a.remove().subscribe((b:any)=>{
                    //console.log(b);
                  }, (e:any)=>{
                    console.log(e);
                  })
                })
              } else {
                // il a déjà été supprimé plus haut
              }

            }
          });

          this.openModal("Groupe "+this.name +" mis à jour");
        })
      } else {
        this.api.Groups.post({name:this.name,description:this.description}).subscribe((d:any)=>{
          // creation du proprietaire du groupe
          this.api.Members.post({profile:'owner', group_id:d.body.id, employee_id:this.owner}).subscribe((m:any)=>{
            // creation des membres
            this.employees.forEach((v:any)=>{
              if(v.check){
                if(v.id!=this.owner){
                  this.api.Members.post({profile:'member', group_id:d.body.id, employee_id:v.id}).subscribe(()=>{
                    console.log("membre", v.id, 'créé');
                  })
                }
              }
            });
            this.openModal("Groupe "+this.name +" créé");
          })

        })
      }

    }
  }

  getGroup(id:number){
    this.api.Groups.get(id,{_includes:'members.employee'}).subscribe((d:any)=>{
      this.group = d;
      this.name = d.body.name;
      this.description = d.body.description;
      this.old_members = d.body.members;
      this.group.members = d.body.members;
      this.owner = _.find(d.body.members, {profile:'owner'}).employee.id;
      this.show_spinnner = false;
      this.group.members.forEach((v:any)=>{
        if(_.find(this.employees,{first_name:v.employee.first_name})!= undefined) {
          let x = _.find(this.employees,{first_name:v.employee.first_name});
          x.check = true;
          x.checked = true;
        }
      });
    })
  }

  async getEmployees(){
    const opt = {
      should_paginate : false,
      _sort:'first_name',
      _sortDir: 'asc'
    };
    this.api.Employees.getList(opt).subscribe((d:any)=>{
      this.show_employee = false;
      this.employees = d;
      const id:any = this.route.snapshot.paramMap.get('id');
      if(id !== undefined && id != null){
        this.getGroup(parseInt(id));
      }
    }, (e:any)=>{
      console.log(e);
      this.show_employee = false;
    })
  }

  test(e:any){
    e.check = !e.check;
  }

  checkForm(){
    if(this.name==undefined || this.name==null || this.name==""){
      this.message_toast = "Nom absent";
      this.show = true;
      return false;
    } else if(this.description==undefined || this.description==null || this.description==""){
      this.message_toast = "Description absente";
      this.show = true;
      return false;
    } else if(this.owner==undefined || this.owner==null || this.owner==""){
      this.message_toast = "Proprietaire absent";
      this.show = true;
      return false;
    } else {
      this.show = false;
      return true;
    }
  }

  openModal(title:string){
    this.show_loading = false;
    this.success_title = title;
    // @ts-ignore
    document.getElementById('btnModal').click();
  }

  open(content:any) {
    this.modalService.open(content, {size: 'sm', centered: true}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if(this.show_bread){
      this.router.navigate(['/admin/list-group']);
    } else {
      this.router.navigate(['/inside/group']);
    }
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
