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

  public managements : any = [];
  public search_text = "";
  closeResult = '';
  public detail : any;
  public show = false;
  constructor(
    private modalService: NgbModal,
    private api : ApiProvider
  ) {
    this.getManagements();
  }

  ngOnInit(): void {
  }


  getManagements(){
    this.show = true;
    const opt = {
      should_paginate: false,
      _sort: 'name',
      _sortDir: 'asc',
      _includes: 'entity,employees'
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
  }

  openModal(n:any){
    this.detail = n;
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
