import {Injectable} from '@angular/core';
import {Restangular} from 'ngx-restangular';
import {Router} from '@angular/router';
import * as _ from "lodash";
import {ApiProvider} from "../api/api";
/*
  Generated class for the ApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable()
export class UtilProvider {


  public index_news :any = [];
  public events :any = [];
  public note :any = [];
  constructor(private api: ApiProvider) {
  }

  async getNoteOfEntity(events:any[],note:any[],user:any){
    // recuperation de l'entitié de l'employé
    this.api.Managements.get(user.employee.direction_id,{_includes:'entity'}).subscribe((a:any)=>{
      // recuperation des notes de l'entitié d'appartenance
      let opt = {
        should_paginte:false,
        _sort:'created_at',
        _sortDir:'desc',
        entity_id: a.body.entity_id,
        _includes: 'newsletter'
      };
      this.api.NewsletterEntities.getList(opt).subscribe((d:any)=>{
        d.forEach((v:any)=>{
          if(v.newsletter.type == 'event'){
            events.push(v.newsletter);
            this.index_news.push(v.newsletter.id);
          } else {
            note.push(v.newsletter);
            this.index_news.push(v.newsletter.id);
          }
        });
        //events = _.orderBy(events,'date').reverse();
        //note = _.orderBy(note,'date').reverse();
        this.getNoteOfDirection(events,note,user);
      }, (e:any)=>{
        console.log(e);
      })
    }, (e:any)=>{
      console.log(e);
    });
  }

  async getNoteOfDirection(events:any[],note:any[],user:any){
    console.log(note);
    const opt = {
      direction_id:user.employee.direction_id,
      should_paginte:false,
      _sort:'created_at',
      _sortDir:'desc',
      _includes: 'newsletter'
    };
    this.api.NewsletterDirections.getList(opt).subscribe((d:any)=>{
      d.forEach((v:any)=>{
        if(v.newsletter.type == 'event'){
          // recuparation de l'index
          if(this.index_news.indexOf(v.newsletter.id)===-1) { // n'existe pas dans le tableau
            events.push(v.newsletter);
            this.index_news.push(v.newsletter.id);
          }
        } else {
          // recuparation de l'index
          if(this.index_news.indexOf(v.newsletter.id)===-1) { // n'existe pas dans le tableau
            note.push(v.newsletter);
            this.index_news.push(v.newsletter.id);
          }
        }
      });
      this.getNoteOfGroup(events,note,user.employee.id);
    }, (e:any)=>{
      console.log(e);
    })
  }

  getNoteOfGroup(events:any[],note:any[],employee_id:number){
    // recuperation des groupes de l'employé
    console.log(note);
    const opt = {
      employee_id,
      _includes: "group",
      should_paginte:false
    };
    this.api.Members.getList(opt).subscribe((a:any)=>{
      // recupération des notes de chaque groupe
      a.forEach((v:any)=>{
        let opt2 = {
          per_page:10,
          _sort:'created_at',
          _sortDir:'desc',
          group_id: v.id,
          _includes: 'newsletter'
        };
        this.api.NewsletterGroups.getList(opt2).subscribe((d:any)=>{
          d.forEach((v:any)=>{
            if(v.newsletter.type == 'event'){
              // recuparation de l'index
              if(this.index_news.indexOf(v.newsletter.id)===-1) { // n'existe pas dans le tableau
                events.push(v.newsletter);
              }
            } else {
              // recuparation de l'index
              if(this.index_news.indexOf(v.newsletter.id)===-1) { // n'existe pas dans le tableau
                note.push(v.newsletter);
              }
            }
          });
          events = _.orderBy(events,'date').reverse();
          note = _.orderBy(note,'date').reverse();
        }, (e:any)=>{
          console.log(e);
        })
      });
    }, (e:any)=>{
      console.log(e);
    });
  }
}
