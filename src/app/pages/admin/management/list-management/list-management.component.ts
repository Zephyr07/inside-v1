import { Component, OnInit } from '@angular/core';
import {ApiProvider} from "../../../../providers/api/api";

@Component({
  selector: 'app-list-management',
  templateUrl: './list-management.component.html',
  styleUrls: ['./list-management.component.scss']
})
export class ListManagementComponent implements OnInit {

  public managements : any = [];
  public search_text = "";
  public show = false;
  constructor(
    private api : ApiProvider
  ) {
    this.getManagements();
  }

  ngOnInit(): void {
  }

  search(){

  }

  getManagements(){
    this.show = true;
    const opt = {
      should_paginate: false,
      _sort: 'name',
      _sortDir: 'asc',
      _includes: 'entity'
    };

    this.api.Managements.getList(opt).subscribe((d:any)=>{
      this.managements = d;
      this.show = false;
    }, (e: any) => {
      this.show = false;
      console.log(e);
    })
  }

  deleteManagement(id:number){
    this.show = true;
    this.api.Managements.get(id).subscribe((d:any)=>{
      d.id=d.body.id;
      d.remove().subscribe((a:any)=>{
        alert('Entité supprimée');
        this.getManagements();
      }, (e:any) => {
        console.log(e);
        this.show = false;
      })
    })
  }

}
