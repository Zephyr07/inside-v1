import { Component, OnInit } from '@angular/core';
import {ApiProvider} from "../../providers/api/api";
import * as _ from "lodash";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-list-note',
  templateUrl: './list-note.component.html',
  styleUrls: ['./list-note.component.scss']
})
export class ListNoteComponent implements OnInit {
  private user :any;
  public note : any;
  public detail : any;
  public search_text = "";
  closeResult = '';
  public show = true;
  constructor(
    private modalService: NgbModal,
    private sanitizer: DomSanitizer,
    private api : ApiProvider
  ) {
    // @ts-ignore
    this.user = JSON.parse(localStorage.getItem('user'));
    this.getNote();
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

  openModal(n:any){
    this.detail = n;
    this.detail.fichier = this.sanitizer.bypassSecurityTrustResourceUrl(n.newsletter.file);
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
