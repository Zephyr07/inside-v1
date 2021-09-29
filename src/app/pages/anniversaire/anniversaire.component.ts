import { Component, OnInit } from '@angular/core';
import * as _ from "lodash";
import {ApiProvider} from "../../providers/api/api";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {MOIS} from "../../services/contants";

@Component({
  selector: 'app-anniversaire',
  templateUrl: './anniversaire.component.html',
  styleUrls: ['./anniversaire.component.scss']
})
export class AnniversaireComponent implements OnInit {
  public anniv : any;
  public show_anniv =true;
  public employee:any;
  public search_text = '';
  closeResult = '';
  constructor(
    private modalService: NgbModal,
    private api: ApiProvider
  ) {

  }

  ngOnInit(): void {
    this.getBirthday();
  }

  getBirthday(){
    this.anniv = [];
    const opt = {
      should_paginate: false,
      _sort:'birthday',
      _sortDir:'asc',
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
        if(v.last_name) {
          v.nom = v.last_name.split(' ')[0];
        } else {
          v.nom = v.first_name.split(' ')[0];
        }
        if(v.birthday){
          v.mois = parseInt(v.birthday.split('-')[1]);
          v.jour = parseInt(v.birthday.split('-')[2])
        }
      });
      e = _.groupBy(e,'mois');
      /*for(let x in e){
        console.log(e[x]);
        e[x]=_.orderBy(e[x],'jour');
      }*/
      for(let x in e){
        this.anniv.push({
          mois: MOIS[parseInt(x)-1],
          employee:e[x]
        })
      }
      this.show_anniv = false;
    }, (e:any)=>{
      console.log(e);
    })
  }

  openModal(n:any){
    this.employee = n;
    // @ts-ignore
    document.getElementById('btnModal').click();
  }

  open(content:any) {
    this.modalService.open(content, {centered: true}).result.then((result) => {
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
