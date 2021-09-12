import { Component, OnInit } from '@angular/core';
import {ApiProvider} from "../../../../providers/api/api";

@Component({
  selector: 'app-list-content',
  templateUrl: './list-content.component.html',
  styleUrls: ['./list-content.component.scss']
})
export class ListContentComponent implements OnInit {

  public contents : any = [];
  public search_text = "";
  public show = true;
  constructor(
    private api : ApiProvider
  ) {
    this.getContents();
  }

  ngOnInit(): void {
  }

  search(){

  }

  getContents(){
    const opt = {
      should_paginate: false,
      _sort: 'name',
      _sortDir: 'asc',
    };

    this.api.Contents.getList(opt).subscribe((d:any)=>{
      this.contents = d;
      this.show = false;
    }, (e:any)=>{
      console.log(e);
      this.show = false;
    })
  }

  deleteContent(id:number){
    this.show = true;
    this.api.Contents.get(id).subscribe((d:any)=>{
      d.id=d.body.id;
      d.remove().subscribe((a:any)=>{
        alert('Entité supprimée');
        this.getContents();
      }, (e:any) => {
        console.log(e);
        this.show = false;
      })
    })
  }

}
