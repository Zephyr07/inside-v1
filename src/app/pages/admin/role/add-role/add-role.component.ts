import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ModalDismissReasons, NgbCalendar, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ApiProvider} from "../../../../providers/api/api";
import * as _ from "lodash";

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss']
})
export class AddRoleComponent implements OnInit {
  show = false;
  show_spinnner = false;
  show_loading = false;
  show_direction = true;
  show_permission = true;
  public message_toast = "";
  public success_title = "";
  closeResult = '';
  public titre ="Nouveau rôle";
  public name ="";
  public description ="";
  public display_name ="";
  public file = new FormData();
  public permissions:any = [];
  public role:any;
  constructor(
    private api: ApiProvider,
    public route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal
  ) {
    const id:any = this.route.snapshot.paramMap.get('id');
    if(id !== undefined && id != null){
      this.getRole(parseInt(id));
      this.show_spinnner = true;
      this.titre = "Modification";
    } else {
      this.getPermissions();
    }
  }

  ngOnInit(): void {}

  saveRole(){
    if(this.checkForm()){
      this.show_loading = true;
      if(this.role!=null && this.role!=undefined){
        // update
        this.role.id = this.role.body.id;
        this.role.name = this.name;
        this.role.description = this.description;
        this.role.display_name = this.display_name;
        this.role.put().subscribe((n:any)=>{
          this.openModal("Rôle "+this.display_name + " mis à jour");
          // traitement des permissions
          this.permissions.forEach((v:any)=>{
            // ajout
            if(v.check){
              // verification si la permission n'est pas déjà membre
              if(_.find(this.role.body.permissions,{id:v.id})== undefined) {
                this.api.PermissionRoles.post({permission_id:v.id,role_id:n.body.id}).subscribe(()=>{
                  console.log("permission", v.id, 'créé');
                }, (e:any)=>{
                  console.log(e);
                })
              }

            } else {
              // suppremssion
              const x = _.find(this.role.body.permissions,{id:v.id});
              if(x!=undefined){
                this.api.PermissionRoles.get(x.id).subscribe((a:any)=>{
                  a.id = a.body.id;
                  a.remove().subscribe((b:any)=>{
                    console.log(b);
                  }, (e:any)=>{
                    console.log(e);
                  })
                })
              }
            }
          });
        })
      } else {
        // creation
        const opt = {
          name:this.name,
          description:this.description,
          display_name:this.display_name
        };
        this.api.Roles.post(opt).subscribe((n:any)=>{
          this.openModal("Rôle "+this.display_name + " créé");
          // affectation permission
          this.permissions.forEach((e:any)=>{
            if(e.check){
              this.api.PermissionRoles.post({permission_id:e.id,role_id:n.body.id});
              e.check = false;
            }
          });

        }, (e:any)=>{
          console.log(e);
        })
      }
    }
  }



  getRole(id:number){
    const opt = {
      _includes: "permissions"
    };
    this.api.Roles.get(id,opt).subscribe((d:any)=>{
      this.role = d;
      this.name = d.body.name;
      this.description = d.body.description;
      this.display_name = d.body.display_name;
      this.show_spinnner = false;
      this.getPermissions();
    }, (e:any)=>{
      console.log(e);
    })
  }

  getPermissions(){
    const opt = {
      should_paginate : false,
      _sort:'display_name',
      _sortDir: 'asc'
    };
    this.api.Permissions.getList(opt).subscribe((d:any)=>{
      this.permissions = d;
      this.show_permission = false;
      const id:any = this.route.snapshot.paramMap.get('id');
      if(id !== undefined && id != null){
        this.role.body.permissions.forEach((v:any)=>{
          if(_.find(this.permissions,{id:v.id})!= undefined) {
            let x = _.find(this.permissions,{id:v.id});
            x.check = true;
            x.checked = true;
          }
        });
      }
    }, (e:any)=>{
      console.log(e);
    })
  }

  test(e:any){
    e.check = !e.check;
  }

  checkForm() {
    if(this.name==undefined || this.name==null || this.name==""){
      this.message_toast = "Code absent";
      this.show = true;
      return false;
    } else if(this.display_name==undefined || this.display_name==null || this.display_name == ""){
      this.message_toast = "Nom absent";
      this.show = true;
      return false;
    } else if(this.description==undefined || this.description==null || this.description==""){
      this.message_toast = "Description absente";
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
    this.router.navigate(['/admin/list-role']);
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
