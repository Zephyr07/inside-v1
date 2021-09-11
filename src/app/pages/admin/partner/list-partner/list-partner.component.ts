import { Component, OnInit } from '@angular/core';
import {ApiProvider} from "../../../../providers/api/api";

@Component({
  selector: 'app-list-partner',
  templateUrl: './list-partner.component.html',
  styleUrls: ['./list-partner.component.scss']
})
export class ListPartnerComponent implements OnInit {

  public partners : any = [];
  public search_text = "";
  public show = false;
  constructor(
    private api : ApiProvider
  ) {
    this.getPartners();
  }

  ngOnInit(): void {
  }

  search(){

  }

  getPartners(){
    this.show = true;
    const opt = {
      should_paginate: false,
      _sort: 'name',
      _sortDir: 'asc',
      _includes: 'entity'
    };

    this.api.Partners.getList(opt).subscribe((d:any)=>{
      this.partners = d;
      this.show = false;
    }, (e: any) => {
      this.show = false;
      console.log(e);
    })
  }

  deletePartner(id:number){
    this.show = true;
    this.api.Partners.get(id).subscribe((d:any)=>{
      d.id=d.body.id;
      d.remove().subscribe((a:any)=>{
        alert('Partenaire supprimé');
        this.getPartners();
      }, (e:any) => {
        console.log(e);
        this.show = false;
      })
    })
  }

}
