import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ApiProvider} from "../../../../providers/api/api";
import * as _ from 'lodash';

@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.scss']
})
export class AddGroupComponent implements OnInit {

  public employees:any = [];
  public members:any = [];
  public old_members:any = [];
  public name = "";
  public description = "";
  public owner = "";
  public title = "Nouveau groupe";
  private group:any;
  constructor(
    public route: ActivatedRoute,
    private api:ApiProvider
  ) {
    const id:any = this.route.snapshot.paramMap.get('id');
    if(id !== undefined && id != null){
      this.title = "Modification";
    }
    this.getEmployees();
    this.group = {
      members :[]
    };
  }

  ngOnInit(): void {

  }

  saveGroup(){
    if(this.name !== undefined && this.name !== "" && this.description !== undefined && this.description !== "") {
      if(this.group.body !== undefined && this.group.body !== null){
        this.group.id = this.group.body.id;
        this.group.name = this.name;
        this.group.acronym = this.description;
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
                  console.log("membre", v.id, 'créé');
                }, (e:any)=>{
                  console.log(e);
                })
              }

            } else {
              // suppremssion
              const x = _.find(this.group.body.members,{employee_id:v.id});
              if(x.profile !='owner'){
                this.api.Members.get(x.id).subscribe((a:any)=>{
                  a.id = a.body.id;
                  a.remove().subscribe((b:any)=>{
                    console.log(b);
                  }, (e:any)=>{
                    console.log(e);
                  })
                })
              } else {
                // il a déjà été supprimé plus haut
              }

            }
          });

          alert("Groupe modifié");
        })
      } else {
        this.api.Groups.post({name:this.name,description:this.description}).subscribe((d:any)=>{
          // creation du proprietaire du groupe
          this.api.Members.post({profile:'owner', group_id:d.body.id, employee_id:this.owner}).subscribe((m:any)=>{
            // creation des membres
            this.employees.forEach((v:any)=>{
              if(v.check){
                this.api.Members.post({profile:'member', group_id:d.body.id, employee_id:v.id}).subscribe(()=>{
                  console.log("membre", v.id, 'créé');
                })
              }
            });
            alert("Group enregistrée");
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
      console.log(this.owner);
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
      _sort:'last_name',
      _sortDir: 'asc'
    };
    this.api.Employees.getList(opt).subscribe((d:any)=>{
      this.employees = d;
      const id:any = this.route.snapshot.paramMap.get('id');
      if(id !== undefined && id != null){
        this.getGroup(parseInt(id));
      }
    })
  }

  test(e:any){
    e.check = !e.check;
  }

}
