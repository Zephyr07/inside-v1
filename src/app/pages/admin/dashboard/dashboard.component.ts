import { Component, OnInit } from '@angular/core';
import {ApiProvider} from "../../../providers/api/api";
import * as _ from "lodash";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  entities = [];
  show_entity = true;
  directions = [];
  show_direction = true;
  employees = [];
  show_employee = true;
  groups = [];
  show_group = true;
  show_newsletter = true;
  informations = 0;
  services = 0;
  events = 0;
  suggestions = [];
  show_suggestion = true;
  constructor(
    private api:ApiProvider
  ) { }

  ngOnInit(): void {
    this.getEntities();
    this.getGroups();
    this.getManagement();
    this.getNewsletters();
    this.getUsers();
    this.getSuggestion();
  }

  getEntities(){
    const opt = {
      should_paginate: false,
      _agg: 'count'
    };

    this.api.Entities.getList(opt).subscribe((d:any)=>{
      this.entities = d[0].value;
      this.show_entity = false;
    }, (e:any)=>{
      console.log(e);
      this.show_entity = false;
    })
  }

  getManagement(){
    const opt = {
      should_paginate: false,
      _agg: 'count'
    };

    this.api.Managements.getList(opt).subscribe((d:any)=>{
      this.directions = d[0].value;
      this.show_direction = false;
    }, (e:any)=>{
      console.log(e);
      this.show_direction = false;
    })
  }

  getNewsletters() {
    const opt = {
      should_paginate: false,
    };

    this.api.Newsletters.getList(opt).subscribe((d: any) => {
      const x = _.groupBy(d,'type');
      for(let i in x){
        if(i === "event"){
          this.events = x[i].length;
        } else if(i === 'information'){
          this.informations = x[i].length;
        } else if(i === 'service'){
          this.services = x[i].length;
        }
      }
      this.show_newsletter = false;
    }, (e: any) => {
      this.show_newsletter = false;
      console.log(e);
    })
  }

  getGroups(){
    const opt = {
      should_paginate: false,
      _agg: 'count'
    };

    this.api.Groups.getList(opt).subscribe((d:any)=>{
      this.show_group = false;
      this.groups = d[0].value;
    }, (e: any) => {
      this.show_group = false;
      console.log(e);
    })
  }

  getUsers(){
    const opt = {
      should_paginate: false,
      _agg: 'count'
    };

    this.api.Users.getList(opt).subscribe((d:any)=>{
      this.show_employee = false;
      this.employees = d[0].value;
    }, (e: any) => {
      this.show_employee = false;
      console.log(e);
    })
  }

  getSuggestion(){
    const opt = {
      should_paginate: false,
      _agg: 'count'
    };

    this.api.Suggestions.getList(opt).subscribe((d:any)=>{
      this.show_suggestion = false;
      this.suggestions = d[0].value;
    }, (e: any) => {
      this.show_suggestion = false;
      console.log(e);
    })
  }

}
