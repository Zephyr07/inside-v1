import { Component, OnInit } from '@angular/core';
import {ApiProvider} from "../../providers/api/api";
import * as _ from "lodash";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {DomSanitizer} from "@angular/platform-browser";
import {UtilProvider} from "../../providers/util/util";

@Component({
  selector: 'app-list-note',
  templateUrl: './list-note.component.html',
  styleUrls: ['./list-note.component.scss']
})
export class ListNoteComponent implements OnInit {
  private user :any;
  public note : any = [];
  public events : any = [];
  public index_news : any = [];
  public detail : any;
  public search_text = "";
  closeResult = '';
  public show = true;
  constructor(
    private modalService: NgbModal,
    private sanitizer: DomSanitizer,
    private api : ApiProvider,
    private util : UtilProvider
  ) {
    // @ts-ignore
    this.user = JSON.parse(localStorage.getItem('user'));
    //this.getNote();
    this.getNoteOfEntity();
  }

  ngOnInit(): void {
  }

  getNote(){
    // recuperation de l'entitié de l'employé
    this.api.Managements.get(this.user.employee.direction_id,{_includes:'entity'}).subscribe((a:any)=>{
      // recuperation des notes de l'entitié d'appartenance
      //this.entity = "de "+a.body.entity.name;
      let opt = {
        should_paginate: false,
        _sort:'updated_at',
        entity_id: a.body.entity_id,
        _includes: 'newsletter'
      };
      this.api.NewsletterEntities.getList(opt).subscribe((d:any)=>{
        this.note = [];
        d.forEach((v:any)=>{
          if(v.newsletter.type !== 'event'){
            this.note.push(v);
          }
        });
        // recupération des notes de la direction d'appartenance
        let opt = {
          should_paginate: false,
          _sort:'updated_at',
          direction_id: this.user.employee.direction_id,
          _includes: 'newsletter'
        };
        this.api.NewsletterDirections.getList(opt).subscribe((e:any)=>{
          e.forEach((x:any)=>{
            if(x.newsletter.type != 'event'){
              if(_.find(d,{'newsletter':x.newsletter})==undefined) {// pas encore dans la liste
                this.note.push(x);
              }
            }
          });
          this.show = false;
        }, (e:any)=>{
          console.log(e);
        })
      }, (e:any)=>{
        console.log(e);
      })
    }, (e:any)=>{
      console.log(e);
    });
  }

  async getNoteOfEntity(){
    // recuperation de l'entitié de l'employé
    this.api.Managements.get(this.user.employee.direction_id,{_includes:'entity'}).subscribe((a:any)=>{
      // recuperation des notes de l'entitié d'appartenance
      let opt = {
        per_page:10,
        _sort:'created_at',
        _sortDir:'desc',
        entity_id: a.body.entity_id,
        _includes: 'newsletter'
      };
      this.api.NewsletterEntities.getList(opt).subscribe((d:any)=>{
        d.forEach((v:any)=>{
          if(v.newsletter.type == 'event'){
            this.events.push(v.newsletter);
            this.index_news.push(v.newsletter.id);
          } else {
            this.note.push(v.newsletter);
            this.index_news.push(v.newsletter.id);
          }
        });
        //this.events = _.orderBy(this.events,'date').reverse();
        //this.note = _.orderBy(this.note,'date').reverse();
        this.getNoteOfDirection(this.user.employee.direction_id);
      }, (e:any)=>{
        console.log(e);
      })
    }, (e:any)=>{
      console.log(e);
    });
  }

  async getNoteOfDirection(direction_id:number){
    const opt = {
      direction_id,
      per_page:10,
      _sort:'created_at',
      _sortDir:'desc',
      _includes: 'newsletter'
    };
    this.api.NewsletterDirections.getList(opt).subscribe((d:any)=>{
      d.forEach((v:any)=>{
        if(v.newsletter.type == 'event'){
          // recuparation de l'index
          if(this.index_news.indexOf(v.newsletter.id)===-1) { // n'existe pas dans le tableau
            this.events.push(v.newsletter);
            this.index_news.push(v.newsletter.id);
          }
        } else {
          // recuparation de l'index
          if(this.index_news.indexOf(v.newsletter.id)===-1) { // n'existe pas dans le tableau
            this.note.push(v.newsletter);
            this.index_news.push(v.newsletter.id);
          }
        }
      });
      this.getNoteOfGroup(this.user.employee.id);
    }, (e:any)=>{
      console.log(e);
    })
  }

  getNoteOfGroup(employee_id:number){
    // recuperation des groupes de l'employé
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
                this.events.push(v.newsletter);
              }
            } else {
              // recuparation de l'index
              if(this.index_news.indexOf(v.newsletter.id)===-1) { // n'existe pas dans le tableau
                this.note.push(v.newsletter);
              }
            }
          });
          this.events = _.orderBy(this.events,'date').reverse();
          this.note = _.orderBy(this.note,'date').reverse();
          this.show = false;
        }, (e:any)=>{
          console.log(e);
        })
      });
    }, (e:any)=>{
      console.log(e);
    });
  }

  openModal(n:any){
    this.detail = n;
    this.detail.fichier = this.sanitizer.bypassSecurityTrustResourceUrl(n.file);
    // @ts-ignore
    document.getElementById('btnModal').click();
  }

  open(content:any) {
    this.modalService.open(content, {size: 'xl',scrollable: true}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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
