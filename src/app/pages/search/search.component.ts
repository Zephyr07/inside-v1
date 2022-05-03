import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ApiProvider} from "../../providers/api/api";
import * as _ from "lodash";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  public show_group = true;
  public show_employee = true;
  public show_direction = true;
  public show_newsletter = true;
  public directions:any =[];
  public emp:any =[];
  public employees:any =[];
  public events:any =[];
  public newsletters:any =[];
  public groups:any =[];

  public query = "";
  public search_text = "";
  public state = "description";
  public closeResult = "";
  public employee:any={};
  public news:any={};
  public detail:any={};
  public note_group:any={};
  constructor(
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private sanitizer: DomSanitizer,
    private api:ApiProvider
    ) {
    // @ts-ignore
    this.query = this.route.snapshot.paramMap.get('query');
    this.search();

  }

  ngOnInit(): void {

  }

  search(){
    console.log(this.query);
    if(this.query!="" && this.query.length>=3){
      this.show_group = true;
      this.show_direction = true;
      this.show_employee = true;
      this.show_newsletter = true;
      this.directions =[];
      this.employees =[];
      this.events =[];
      this.newsletters =[];
      this.groups =[];
      this.getDirectionsByQuery(this.query);
      this.getEmployeesByQuery(this.query);
      this.getNewslettersByQuery(this.query);
      this.getGroupsByQuery(this.query);
    } else {
      alert("Il faut minimum 3 caractères pour lancer la recherche");
    }
  }

  getDirectionsByQuery(q:any){
    const opt = {
      should_paginte: false,
      _sort:'name',
      _sortDir:'asc',
      'name-lk':q
    };

    this.api.Managements.getList(opt).subscribe((d:any)=>{
      this.directions = d;
      this.show_direction = false;
    }, (e:any)=>{
      this.show_direction = false;
    })
  }

  getGroupsByQuery(q:any){
    const opt = {
      should_paginte: false,
      _sort:'name',
      _sortDir:'asc',
      'name-lk':q
    };

    this.api.Groups.getList(opt).subscribe((d:any)=>{
      this.groups = d;
      this.show_group = false;
    }, (e:any)=>{
      this.show_group = false;
    })
  }

  getEmployees(){
    const opt = {
      should_paginate:false,
      _includes:'direction.entity'
    };
    this.api.Employees.getList(opt).subscribe((e:any)=>{
      e.forEach((v:any)=>{
        if(_.find(e, {id:v.sup_id})!=undefined){
          v.superieur = _.find(e, {id:v.sup_id});
        } else {
          v.superieur = {first_name : 'supérieur hiérachique',
            last_name:'Aucun'}
        }
        // gestion des collaborateurs
        v.collaborateur = _.filter(this.emp,{sup_id:v.id});
        v.collaborateur = _.orderBy(v.collaborateur,'first_name');
        if(v.birthday){
          v.mois = parseInt(v.birthday.split('-')[1]);
          v.jour = parseInt(v.birthday.split('-')[2])
        } else {
          v.mois = 'Inconnu';
          v.jour = 'Inconnu';
        }

      });
      this.emp = e;
    })
  }

  getEmployeesByQuery(q:any){
    const opt = {
      should_paginte: false,
      _sort:'name',
      _sortDir:'asc',
      'first_name-lk':q,
      _includes:'direction.entity'
    };

    this.api.Employees.getList(opt).subscribe((e:any)=>{
      e.forEach((v:any)=>{
        if(_.find(e, {id:v.sup_id})!=undefined){
          v.superieur = _.find(e, {id:v.sup_id});
        } else {
          v.superieur = {first_name : 'supérieur hiérachique',
            last_name:'Aucun'}
        }
        // gestion des collaborateurs
        v.collaborateur = _.filter(e,{sup_id:v.id});
        v.collaborateur = _.orderBy(v.collaborateur,'first_name');
        if(v.birthday){
          v.mois = parseInt(v.birthday.split('-')[1]);
          v.jour = parseInt(v.birthday.split('-')[2])
        } else {
          v.mois = 'Inconnu';
          v.jour = 'Inconnu';
        }

      });
      this.employees = e;
      this.show_employee = false;
    }, (e:any)=>{
      this.show_employee = false;
    })
  }

  getNewslettersByQuery(q:any){
    const opt = {
      should_paginte: false,
      _sort:'title',
      _sortDir:'asc',
      'title-lk':q
    };

    this.api.Newsletters.getList(opt).subscribe((d:any)=>{
      d.forEach((v:any)=>{
        if(v.newsletter.type == 'event'){
          this.events.push(v);
        } else {
          this.newsletters.push(v);
        }
      });
      this.show_newsletter = false;
    }, (e:any)=>{
      this.show_newsletter = false;
    })
  }

  openModal(id?:any,e?:any){
    if(id){
      this.employee = _.find(this.employees,{id:e.id});
      // @ts-ignore
      document.getElementById(id).click();
    } else {
      // @ts-ignore
      document.getElementById('btnModal').click();
    }
  }

  openEvent(n:any){
    this.detail = n;
    // @ts-ignore
    document.getElementById('btnModalEvent').click();
  }

  openGroup(n:any){
    this.detail = n;
    // recupération des notes du groupe d'appartenance
    let opt = {
      should_paginate: false,
      _sort:'updated_at',
      group_id: n.group.id,
      _includes: 'newsletter'
    };
    this.api.NewsletterGroups.getList(opt).subscribe((e:any)=>{
      this.note_group = e;
    }, (e:any)=>{
      console.log(e);
    });
    // @ts-ignore
    document.getElementById('btnModalGroup').click();
  }

  openNote(n:any){
    this.detail = n;
    this.detail.fichier = this.sanitizer.bypassSecurityTrustResourceUrl(n.newsletter.file);
    // @ts-ignore
    document.getElementById('btnModalNote').click();
  }

  openModal2(n:any){
    this.news = n;
    this.news.fichier = this.sanitizer.bypassSecurityTrustResourceUrl(n.newsletter.file);
    // @ts-ignore
    document.getElementById('btnModal2').click();
  }

  open(content:any, size?:any) {
    if(size){
      this.modalService.open(content, {centered: true,scrollable: true,size}).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    } else {
      this.modalService.open(content, {centered: true,scrollable: true,size: 'xl'}).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }

  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
