import { Component, OnInit } from '@angular/core';
import {ApiProvider} from "../../../../providers/api/api";

@Component({
  selector: 'app-list-role',
  templateUrl: './list-role.component.html',
  styleUrls: ['./list-role.component.scss']
})
export class ListRoleComponent implements OnInit {
  public load = false;
  public roles : any = [];
  public search_text = "";
  public show = true;
  constructor(
    private api : ApiProvider
  ) {
    this.getRoles();
  }

  ngOnInit(): void {
  }

  search(){

  }

  getRoles(){
    const opt = {
      should_paginate: false,
      _sort: 'name',
      _sortDir: 'asc',
    };
    this.api.Roles.getList(opt).subscribe((d:any)=>{
      this.roles = d;
      this.show = false;
    }, (e:any)=>{
      console.log(e);
      this.show = false;
    })
  }

  deleteRole(id:number){
    this.show = true;
    this.api.Roles.get(id).subscribe((d:any)=>{
      d.id=d.body.id;
      d.remove().subscribe((a:any)=>{
        alert('Rôle supprimé');
        this.getRoles();
      }, (e:any) => {
        this.show = false;
        console.log(e);
      })
    })
  }


}
