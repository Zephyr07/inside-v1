import { Component, OnInit } from '@angular/core';
import {ApiProvider} from "../../../../providers/api/api";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  public title = "Nouvel employé";
  public employees:any = [];
  public managements:any = [];

  public user = {
    username:'',
    password:'',
    employee: {
      first_name:'',
      last_name:'',
      phone:'',
      ipphone:'',
      title:'',
      email:'',
      image:'',
      location:'',
      direction_id:'',
      sup_id:''
    },
  };
  constructor(
    public route: ActivatedRoute,
    private api:ApiProvider

  ) {
    const id:any = this.route.snapshot.paramMap.get('id');
    if(id !== undefined && id != null){
      this.getUser(parseInt(id));
      this.title = "Modification";
    }
  }

  ngOnInit(): void {
    this.getEmployees();
    this.getManagements();
  }

  saveUser(){

  }

  getEmployees(){
    const opt = {
      should_paginate : false,
      _sort:'first_name',
      _sortDir: 'asc'
    };
    this.api.Employees.getList(opt).subscribe((d:any)=>{
      this.employees = d;
    })
  }

  getManagements(){
    const opt = {
      should_paginate : false,
      _sort:'name',
      _sortDir: 'asc'
    };
    this.api.Managements.getList(opt).subscribe((d:any)=>{
      this.managements = d;
    })
  }

  getUser(id:number){
    this.api.Users.get(id,{_includes:'employee'}).subscribe((d:any)=>{
      this.user = d.body;
    })
  }

}
