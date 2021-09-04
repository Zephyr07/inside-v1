import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ApiProvider} from "../../../../providers/api/api";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-add-management',
  templateUrl: './add-management.component.html',
  styleUrls: ['./add-management.component.scss']
})
export class AddManagementComponent implements OnInit {
  show = false;
  show_spinnner = false;
  show_loading = false;
  show_group = true;
  show_employee = true;
  show_direction = true;
  show_entity = true;
  public message_toast = "";
  public success_title = "";
  closeResult = '';
  public entities:any = [];
  public name = "";
  public acronym = "";
  public entity_id = "";
  public title = "Nouvelle entité";
  private management:any;
  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private api:ApiProvider

  ) {
    const id:any = this.route.snapshot.paramMap.get('id');
    if(id !== undefined && id != null){
      this.getManagement(parseInt(id));
      this.show_spinnner = true;
      this.title = "Modification";
    }
  }

  ngOnInit(): void {
    this.getEntities();
  }

  saveManagement(){
    if(this.checkForm()) {
      this.show_loading = true;
      if(this.management !== undefined && this.management !== null){
        this.management.id = this.management.body.id;
        this.management.name = this.name;
        this.management.acronym = this.acronym;
        this.management.entity_id = this.entity_id;
        this.management.put().subscribe((d:any)=>{
          console.log(d);
          this.openModal("Direction "+this.name +" mise à jour");
        })
      } else {
        this.api.Managements.post({name:this.name,acronym:this.acronym,entity_id:this.entity_id}).subscribe((d:any)=>{
          console.log(d.body);
          this.openModal("Direction "+this.name +" créé");
        })
      }

    }
  }

  getManagement(id:number){
    this.api.Managements.get(id).subscribe((d:any)=>{
      this.management = d;
      this.name = d.body.name;
      this.acronym = d.body.acronym;
      this.entity_id = d.body.entity_id;
      this.show_spinnner = false;
    })
  }

  getEntities(){
    const opt = {
      should_paginate : false,
      _sort:'last_name',
      _sortDir: 'asc'
    };
    this.api.Entities.getList(opt).subscribe((d:any)=>{
      console.log(d);
      this.show_entity = false;
      this.entities = d;
    }, (e:any)=>{
      console.log(e);
      this.show_entity = false;
    })
  }

  checkForm(){
    if(this.name==undefined || this.name==null || this.name==""){
      this.message_toast = "Nom absent";
      this.show = true;
      return false;
    } else if(this.acronym==undefined || this.acronym==null || this.acronym==""){
      this.message_toast = "Sigle absent";
      this.show = true;
      return false;
    } else if(this.entity_id==undefined || this.entity_id==null || this.entity_id==""){
      this.message_toast = "Entité absente";
      this.show = true;
      return false;
    } else {
      this.show = false;
      return true;
    }
  }

  openModal(title:string){
    this.show_loading = false;
    this.success_title = title;
    // @ts-ignore
    document.getElementById('btnModal').click();
  }

  open(content:any) {
    this.modalService.open(content, {size: 'sm', centered: true}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    this.router.navigate(['/admin/list-management']);
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
