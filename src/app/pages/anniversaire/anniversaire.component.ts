import { Component, OnInit } from '@angular/core';
import * as _ from "lodash";
import {ApiProvider} from "../../providers/api/api";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-anniversaire',
  templateUrl: './anniversaire.component.html',
  styleUrls: ['./anniversaire.component.scss']
})
export class AnniversaireComponent implements OnInit {
  public MOIS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin','Juillet','Août', 'Septembre','Octobre','Novembre','Decembre'];
  public anniv : any;
  public show_anniv =true;
  public employee:any;
  closeResult = '';
  constructor(
    private modalService: NgbModal,
    private api: ApiProvider
  ) {
    this.getBirthday();
  }

  ngOnInit(): void {
  }

  getBirthday(){
    this.anniv = [];
    const opt = {
      should_paginate: false,
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
        v.mois = parseInt(v.birthday.split('-')[1]);
        v.jour = parseInt(v.birthday.split('-')[2])
      });
      e = _.groupBy(e,'mois');
      for(let x in e){
        this.anniv.push({
          mois: this.MOIS[parseInt(x)-1],
          employee: e[x]
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
