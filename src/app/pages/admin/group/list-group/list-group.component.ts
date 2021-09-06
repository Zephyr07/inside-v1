import { Component, OnInit } from '@angular/core';
import {ApiProvider} from "../../../../providers/api/api";

@Component({
  selector: 'app-list-group',
  templateUrl: './list-group.component.html',
  styleUrls: ['./list-group.component.scss']
})
export class ListGroupComponent implements OnInit {

  public groups : any = [];
  public search_text = "";
  public show = true;
  constructor(
    private api : ApiProvider
  ) {
    this.getGroups();
  }

  ngOnInit(): void {
  }

  search(){

  }

  getGroups(){
    const opt = {
      should_paginate: false,
      _sort: 'name',
      _sortDir: 'asc',
      _includes: 'members.employee'
    };

    this.api.Groups.getList(opt).subscribe((d:any)=>{
      this.show = false;
      d.forEach((g:any)=>{
        g.members.forEach((v:any)=>{
          if(v.profile == 'owner'){
            g.proprio = v.employee.first_name + " " + v.employee.last_name;
          }
        })
      });
      this.groups = d;
    }, (e: any) => {
      this.show = false;
      console.log(e);
    })
  }

  deleteGroup(id:number){
    this.show = true;
    this.api.Groups.get(id).subscribe((d:any)=>{
      d.id=d.body.id;
      d.remove().subscribe((a:any)=>{
        alert('Groupe supprimé');
        this.getGroups();
      }, (e:any) => {
        console.log(e);
        this.show = false;
      })
    })
  }
}
