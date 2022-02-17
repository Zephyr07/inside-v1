import { Component, OnInit } from '@angular/core';
import {ApiProvider} from "../../../../providers/api/api";
import * as _ from "lodash";

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent implements OnInit {
  public users : any = [];
  public search_text = "";
  public show = true;
  constructor(
    private api : ApiProvider
  ) {
    this.getUsers();
  }

  ngOnInit(): void {
  }

  resetPassword(u:any){
    const x = new FormData();
    x.append('_method', 'PUT');
    x.append('password', 'password');
    x.append('password_confirmation', 'password');
    this.api.restangular.all('users/' + u.id).customPOST(x, undefined, undefined, {'Content-Type': undefined}).subscribe((d:any) => {
      alert("Mot de passe reinitialisé " + u.username);
    }, (e:any)=>{
      console.log(e);
    });
  }

  getUsers(){
    const opt = {
      should_paginate: false,
      _sort: 'phone',
      _sortDir: 'asc',
      _includes: 'employee'
    };

    this.api.Users.getList(opt).subscribe((d:any)=>{
      this.show = false;
      d.forEach((v:any)=>{
        if(v.employee!=undefined){
          v.first_name = v.employee.first_name;
          v.last_name = v.employee.last_name;
          v.title = v.employee.title;
        } else {
          v.first_name = "Admin";
          v.last_name = "BVS";
          v.title = "Super";
        }

      });
      this.users = _.orderBy(d,'first_name');
    }, (e: any) => {
      this.show = false;
      console.log(e);
    })
  }

  deleteUser(id:number){
    this.show = true;
    this.api.Users.get(id).subscribe((d:any)=>{
      d.id=d.body.id;
      d.remove().subscribe((a:any)=>{
        alert('Employé supprimé');
        this.getUsers();
      }, (e:any) => {
        console.log(e);
        this.show = false;
      })
    })
  }
}
