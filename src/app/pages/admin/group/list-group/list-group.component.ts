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
      _includes: 'members'
    };

    this.api.Groups.getList(opt).subscribe((d:any)=>{
      console.log(d);
      this.groups = d;
    })
  }

  deleteGroup(id:number){
    this.api.Groups.get(id).subscribe((d:any)=>{
      d.id=d.body.id;
      d.remove().subscribe((a:any)=>{
        alert('Groupe supprimé');
      }, (e:any) => {
        console.log(e);
      })
    })
  }
}
