import {Component, OnInit} from '@angular/core';
import {ApiProvider} from "../../providers/api/api";
import * as _ from "lodash";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  private user :any;
  throttle = 30;
  scrollDistance = 1;
  scrollUpDistance = 2;
  page = 1;
  public post :any = [];
  public show_post = true;
  public anniv :any = [];
  public show_anniv = true;
  public group :any = [];
  public show_group = true;
  public events :any = [];
  public note :any = [];
  public show_note = true;
  public entity = "";
  constructor(
    private api : ApiProvider
  ) {
    // @ts-ignore
    this.user = JSON.parse(localStorage.getItem('user'));
    this.getBirthday();
    this.getGroup();
    this.getNote();
    this.getPost();
  }

  ngOnInit(): void {
  }

  getBirthday(){
    const opt = {
      should_paginate: false,
      'birthday-lk':'-09-'
    };
    this.api.Employees.getList(opt).subscribe((e:any)=>{
      e.forEach((v:any)=>{
        v.anniv = v.birthday.split('-')[2];
      });
      e = _.orderBy(e,'anniv');
      this.anniv = e;
      this.show_anniv = false;
    }, (e:any)=>{
      console.log(e);
    })
  }

  getGroup(){
    const opt = {
      should_paginate: false,
      employee_id : this.user.employee.id,
      profile: 'owner',
      _includes:'group'
    };
    this.api.Members.getList(opt).subscribe((d:any)=>{
      this.group = d;
      this.show_group = false;
    }, (e:any)=>{
      console.log(e);
    })
  }
  
  getNote(){
    // recuperation de l'entitié de l'employé
    this.api.Managements.get(this.user.employee.direction_id,{_includes:'entity'}).subscribe((a:any)=>{
      // recuperation des notes de l'entitié d'appartenance
      this.entity = "de "+a.body.entity.name;
      let opt = {
        per_page:10,
        _sort:'updated_at',
        entity_id: a.body.entity_id,
        _includes: 'newsletter'
      };
      this.api.NewsletterEntities.getList(opt).subscribe((d:any)=>{
        d.forEach((v:any)=>{
          console.log(v.newsletter.type);
          if(v.newsletter.type == 'event'){
            this.events.push(v);
          } else {
            this.note.push(v);
          }
        });
        this.show_note = false;
      }, (e:any)=>{
        console.log(e);
      })
    }, (e:any)=>{
      console.log(e);
    });
  }

  getPost(){
    const opt = {
      per_page:10,
      _sort:'created_at',
      _sortDir:'desc',
      _includes:'employee'
    };
    this.api.Posts.getList(opt).subscribe((p:any)=>{
      p.forEach((v:any)=>{
        if(v.post_id==undefined || v.post_id==null){
          this.post.push(v);
        }
        v.comment = _.filter(p,{post_id:v.id}).length;
      });
      this.show_post = false;
      //console.log(p);
      //this.post = p;
    })
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  onScrollDown(ev:any) {
    //this.getBills(false);
  }

  onUp(ev:any) {
  }
}
