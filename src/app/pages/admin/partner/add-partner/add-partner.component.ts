import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ApiProvider} from "../../../../providers/api/api";

@Component({
  selector: 'app-add-partner',
  templateUrl: './add-partner.component.html',
  styleUrls: ['./add-partner.component.scss']
})
export class AddPartnerComponent implements OnInit {

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
  public address = "";
  public status = "";
  public manager = "";
  public phone = 0;
  public entity_id = "";
  public title = "Nouveau partenaire";
  private partner:any;
  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private api:ApiProvider

  ) {
    const id:any = this.route.snapshot.paramMap.get('id');
    if(id !== undefined && id != null){
      this.getPartner(parseInt(id));
      this.show_spinnner = true;
      this.title = "Modification";
    }
  }

  ngOnInit(): void {
    this.getEntities();
  }

  savePartner(){
    if(this.checkForm()) {
      this.show_loading = true;
      if(this.partner !== undefined && this.partner !== null){
        this.partner.id = this.partner.body.id;
        this.partner.name = this.name;
        this.partner.address = this.address;
        this.partner.manager = this.manager;
        this.partner.phone = this.phone;
        this.partner.entity_id = this.entity_id;
        this.partner.status = this.status;
        this.partner.put().subscribe((d:any)=>{
          console.log(d);
          this.openModal("Partenaire "+this.name +" mise à jour");
        })
      } else {
        this.api.Partners.post({name:this.name,address:this.address,manager:this.manager,phone:this.phone,entity_id:this.entity_id}).subscribe((d:any)=>{
          console.log(d.body);
          this.openModal("Partenaire "+this.name +" créé");
        })
      }

    }
  }

  getPartner(id:number){
    this.api.Partners.get(id).subscribe((d:any)=>{
      this.partner = d;
      this.name = d.body.name;
      this.address = d.body.address;
      this.manager = d.body.manager;
      this.phone = d.body.phone;
      this.entity_id = d.body.entity_id;
      this.status = d.body.status;
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
    } else if(this.address==undefined || this.address==null || this.address==""){
      this.message_toast = "Addresse absente";
      this.show = true;
      return false;
    } else if(this.manager==undefined || this.manager==null || this.manager==""){
      this.message_toast = "Responsable absent";
      this.show = true;
      return false;
    } else if(this.phone==undefined || this.phone==null || this.phone==0){
      this.message_toast = "Téléphone absent";
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
    this.router.navigate(['/admin/list-partner']);
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
