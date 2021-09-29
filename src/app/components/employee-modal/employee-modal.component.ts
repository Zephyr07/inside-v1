import {Component, Input, OnInit} from '@angular/core';

import {MOIS} from "../../services/contants";
import * as _ from "lodash";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
@Component({
  selector: 'app-employee-modal',
  templateUrl: './employee-modal.component.html',
  styleUrls: ['./employee-modal.component.scss']
})
export class EmployeeModalComponent implements OnInit {
  @Input() employee:any;
  public collaborateurs:any = [];
  MOIS = MOIS;
  public closeResult ="";
  constructor(
    private modalService: NgbModal,) {
    //this.collaborateurs = this.employee.collaborateur;
  }

  ngOnInit(): void {
  }

  openModal(id?:any,e?:any){
    // @ts-ignore
    document.getElementById('btnCollab').click();
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
