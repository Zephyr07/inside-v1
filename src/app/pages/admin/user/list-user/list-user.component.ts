import { Component, OnInit } from '@angular/core';
import {ApiProvider} from "../../../../providers/api/api";

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent implements OnInit {
  public users : any = []
  public search_text = "";
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
      console.log(d);
      this.users = d;
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
