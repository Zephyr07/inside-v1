import { Component, OnInit } from '@angular/core';
import {ApiProvider} from "../../../providers/api/api";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import * as _ from "lodash";

@Component({
  selector: 'app-direction',
  templateUrl: './direction.component.html',
  styleUrls: ['./direction.component.scss']
})
export class DirectionComponent implements OnInit {
  public user :any;
  public employee : any = {};
  public employees : any = [];
  public managements : any = [];
  public search_text = "";
  public entite = "";
  closeResult = '';
  public detail : any;
  public show = false;
  constructor(
    private modalService: NgbModal,
    private api : ApiProvider
  ) {
    // @ts-ignore
    this.user = JSON.parse(localStorage.getItem('user'));
    this.getManagements();
  }

  ngOnInit(): void {
    this.getEmployees();
  }

  getManagements(){
    this.api.Managements.get(this.user.employee.direction_id,{_includes:'entity'}).subscribe((a:any)=>{
      this.show = true;
      this.entite = "de "+a.body.entity.name;
      const opt = {
        entity_id: a.body.entity.id,
        should_paginate: false,
        _sort: 'name',
        _sortDir: 'asc',
        _includes: 'employees'
      };

      this.api.Managements.getList(opt).subscribe((d:any)=>{
        d.forEach((v:any)=>{
          v.employees = _.orderBy(v.employees, 'first_name');
        });
        this.managements = d;
        this.show = false;
      }, (e: any) => {
        this.show = false;
        console.log(e);
      })
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
        if(v.birthday){
          v.mois = parseInt(v.birthday.split('-')[1]);
          v.jour = parseInt(v.birthday.split('-')[2])
        } else {
          v.mois = 'Inconnu';
          v.jour = 'Inconnu';
        }

      });
      this.employees = e;
    })
  }

  openModalEmployee(e:any){
    e = _.find(this.employees,{id:e.id});
    e.superieur = _.find(this.employees,{id:e.sup_id});
    this.employee = e;
    // @ts-ignore
    document.getElementById('btnModalUser').click();
  }

  openModal(n:any){
    this.detail = n;
    // @ts-ignore
    document.getElementById('btnModal').click();
  }

  open(content:any,size:any) {
    this.modalService.open(content, {size,scrollable: true}).result.then((result) => {
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
