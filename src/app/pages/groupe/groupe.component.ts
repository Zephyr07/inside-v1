import { Component, OnInit } from '@angular/core';
import {ApiProvider} from "../../providers/api/api";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import * as _ from "lodash";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-groupe',
  templateUrl: './groupe.component.html',
  styleUrls: ['./groupe.component.scss']
})
export class GroupeComponent implements OnInit {
  public user:any;
  public group:any =[];
  public note:any =[];
  public show_group = true;
  closeResult = '';
  public search_text = "";
  public state = "description";
  public detail : any;
  public news : any;
  constructor(
    private modalService: NgbModal,
    private sanitizer: DomSanitizer,
    private api:ApiProvider
  ) {
    // @ts-ignore
    this.user = JSON.parse(localStorage.getItem('user'));
    this.getGroup();
  }

  ngOnInit(): void {

  }

  getGroup(){
    const o = {
      _includes:"members.employee",
      'members-fk':'employee_id='+this.user.employee.id
    };
    this.api.Groups.getList(o).subscribe((d:any)=>{
      this.group = d;
      this.show_group = false;
    })
  }

  getNote(id:any){
    // recupération des notes de la direction d'appartenance
    let opt = {
      should_paginate: false,
      _sort:'updated_at',
      group_id: id,
      _includes: 'newsletter'
    };
    this.api.NewsletterDirections.getList(opt).subscribe((e:any)=>{
      this.note = e;
    }, (e:any)=>{
      console.log(e);
    })
  }

  openModal(n:any){
    this.detail = n;
    // @ts-ignore
    document.getElementById('btnModal').click();
    this.getNote(n.id);
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

  openModal2(n:any){
    this.news = n;
    this.news.fichier = this.sanitizer.bypassSecurityTrustResourceUrl(n.newsletter.file);
    // @ts-ignore
    document.getElementById('btnModal2').click();
  }

}
