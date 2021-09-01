import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ApiProvider} from "../../../../providers/api/api";

@Component({
  selector: 'app-add-management',
  templateUrl: './add-management.component.html',
  styleUrls: ['./add-management.component.scss']
})
export class AddManagementComponent implements OnInit {
  public entities:any = [];
  public name = "";
  public acronym = "";
  public entity_id = "";
  public title = "Nouvelle entité";
  private management:any;
  constructor(
    public route: ActivatedRoute,
    private api:ApiProvider

  ) {
    const id:any = this.route.snapshot.paramMap.get('id');
    if(id !== undefined && id != null){
      this.getManagement(parseInt(id));
      this.title = "Modification";
    }
  }

  ngOnInit(): void {
    this.getEntities();
  }

  saveManagement(){
    if(this.name !== undefined && this.name !== "" && this.acronym !== undefined && this.acronym !== "" && this.entity_id !== undefined && this.entity_id !== "") {
      if(this.management !== undefined && this.management !== null){
        this.management.id = this.management.body.id;
        this.management.name = this.name;
        this.management.acronym = this.acronym;
        this.management.entity_id = this.entity_id;
        this.management.put().subscribe((d:any)=>{
          console.log(d);
          alert("Direction modifiée");
        })
      } else {
        this.api.Managements.post({name:this.name,acronym:this.acronym,entity_id:this.entity_id}).subscribe((d:any)=>{
          console.log(d.body);
          alert("Direction enregistrée");
        })
      }

    }
  }

  getManagement(id:number){
    this.api.Managements.get(id).subscribe((d:any)=>{
      this.management = d;
      this.name = d.body.name;
      this.acronym = d.body.acronym;
      this.entity_id = d.body.entity_id
    })
  }

  getEntities(){
    const opt = {
      should_paginate : false,
      _sort:'last_name',
      _sortDir: 'asc'
    };
    this.api.Entities.getList(opt).subscribe((d:any)=>{
      console.log(d);
      this.entities = d;
    })
  }
}
