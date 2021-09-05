import { Component, OnInit } from '@angular/core';
import {ApiProvider} from "../../../providers/api/api";

@Component({
  selector: 'app-suggestion',
  templateUrl: './suggestion.component.html',
  styleUrls: ['./suggestion.component.scss']
})
export class SuggestionComponent implements OnInit {

  public suggestions : any = [];
  public search_text = "";
  public show = true;
  constructor(
    private api : ApiProvider
  ) {
    this.getSuggestions();
  }

  ngOnInit(): void {
  }


  getSuggestions(){
    const opt = {
      should_paginate: false,
      _sort: 'created_at',
      _sortDir: 'desc',
      _includes: 'employee'
    };

    this.api.Suggestions.getList(opt).subscribe((d:any)=>{
      this.show = false;
      d.forEach((v:any)=>{
        v.employee = v.employee.first_name + " " + v.employee.last_name;
      });
      this.suggestions = d;
    }, (e: any) => {
      this.show = false;
      console.log(e);
    })
  }

  deleteSuggestion(id:number){
    this.show = true;
    this.api.Suggestions.get(id).subscribe((d:any)=>{
      d.id=d.body.id;
      d.remove().subscribe((a:any)=>{
        alert('Suggestion supprimée');
        this.getSuggestions();
      }, (e:any) => {
        console.log(e);
        this.show = false;
      })
    })
  }
}
