import { Component, OnInit } from '@angular/core';
import {ApiProvider} from "../../../providers/api/api";

@Component({
  selector: 'app-annuaire',
  templateUrl: './annuaire.component.html',
  styleUrls: ['./annuaire.component.scss']
})
export class AnnuaireComponent implements OnInit {
  public employees:any = [];
  public search_text = "";
  public show = true;
  constructor(
    private api:ApiProvider
  ) {
    this.getEmployees();
  }

  ngOnInit(): void {
  }

  getEmployees(){
    const opt = {
      should_paginate: false,
      _sort:'first_name',
      _sortDir:'asc',
      status:'active'
    };

    this.api.Employees.getList(opt).subscribe((d:any)=>{
      this.employees = d;
      this.show = false;
    })
  }

}
