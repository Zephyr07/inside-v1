import { Component, OnInit } from '@angular/core';
import {ApiProvider} from "../../../../providers/api/api";

@Component({
  selector: 'app-list-newsletter',
  templateUrl: './list-newsletter.component.html',
  styleUrls: ['./list-newsletter.component.scss']
})
export class ListNewsletterComponent implements OnInit {

  public newsletters : any;
  public search_text = "";
  public show = true;
  constructor(
    private api : ApiProvider
  ) {
    this.getNewsletters();
  }

  ngOnInit(): void {
  }

  search(){

  }

  getNewsletters(){
    const opt = {
      should_paginate: false,
      'type-in':'information,service',
      _sort: 'title',
      _sortDir: 'asc',
      _includes: 'newsletter_directions.direction,newsletter_groups.group,newsletter_entities.entity'
    };

    this.api.Newsletters.getList(opt).subscribe((d:any)=>{
      this.show = false;
      this.newsletters = d;
    }, (e: any) => {
      this.show = false;
      console.log(e);
    })
  }

  deleteNewsletter(id:number){
    this.show = true;
    this.api.Newsletters.get(id).subscribe((d:any)=>{
      d.id=d.body.id;
      d.remove().subscribe((a:any)=>{
        alert('Note supprimée');
        this.getNewsletters();
      }, (e:any) => {
        console.log(e);
        this.show = false;
      })
    })
  }
}
