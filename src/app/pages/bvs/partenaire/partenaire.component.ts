import { Component, OnInit } from '@angular/core';
import {ApiProvider} from "../../../providers/api/api";

@Component({
  selector: 'app-partenaire',
  templateUrl: './partenaire.component.html',
  styleUrls: ['./partenaire.component.scss']
})
export class PartenaireComponent implements OnInit {
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


}
