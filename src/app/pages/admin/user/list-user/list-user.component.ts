import { Component, OnInit } from '@angular/core';
import {ApiProvider} from "../../../../providers/api/api";

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

  search(){

  }

  getUsers(){
    const opt = {
      should_paginate: false,
      _sort: 'username',
      _sortDir: 'asc',
      _includes: 'employee'
    };

    this.api.Users.getList(opt).subscribe((d:any)=>{
      this.show = false;
      d.forEach((v:any)=>{
        v.first_name = v.employee.first_name;
        v.last_name = v.employee.last_name;
        v.title = v.employee.title;
      })
      this.users = d;
    }, (e: any) => {
      this.show = false;
      console.log(e);
    })
  }

  deleteUser(id:number){
    this.api.Users.get(id).subscribe((d:any)=>{
      d.id=d.body.id;
      d.remove().subscribe((a:any)=>{
        alert('Employé supprimé');
      }, (e:any) => {
        console.log(e);
      })
    })
  }
}
