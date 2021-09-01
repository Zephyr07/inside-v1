import { Component, OnInit } from '@angular/core';
import {ApiProvider} from "../../../../providers/api/api";

@Component({
  selector: 'app-list-entity',
  templateUrl: './list-entity.component.html',
  styleUrls: ['./list-entity.component.scss']
})
export class ListEntityComponent implements OnInit {

  public entities : any = [];
  public search_text = "";
  constructor(
    private api : ApiProvider
  ) {
    this.getEntities();
  }

  ngOnInit(): void {
  }

  search(){

  }

  getEntities(){
    const opt = {
      should_paginate: false,
      _sort: 'name',
      _sortDir: 'asc',
    };

    this.api.Entities.getList(opt).subscribe((d:any)=>{
      console.log(d);
      this.entities = d;
    })
  }

  deleteEntity(id:number){
    this.api.Entities.get(id).subscribe((d:any)=>{
      d.id=d.body.id;
      d.remove().subscribe((a:any)=>{
        alert('Entité supprimée');
      }, (e:any) => {
        console.log(e);
      })
    })
  }

}
