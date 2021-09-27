import { Component, OnInit } from '@angular/core';
import {ApiProvider} from "../../providers/api/api";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import * as _ from "lodash";
import {AuthProvider} from "../../providers/auth/auth";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {regexValidators} from "../../services/regex";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public u: any;
  public user: any;
  public sup: any = {};
  public direction: any = {};
  public title = '';
  public contenu = '';
  public suggestions:any = [];
  public state = 'new_suggestion';
  public show = false;
  public show_loading = false;
  public titre_toast = "";
  public message_toast = "";
  public success_title = "";
  closeResult = '';
  public signupForm: FormGroup;


  constructor(
    private api:ApiProvider,
    private auth:AuthProvider,
    private modalService: NgbModal,
    private formBuilder: FormBuilder
  ) {
    this.signupForm = this.formBuilder.group({
      current_password: new FormControl('', Validators.compose([
          Validators.required
        ])
      ),

      password: new FormControl('', Validators.compose([
          Validators.required,
          Validators.pattern(regexValidators.password)
        ])
      ),

      password_confirmation: new FormControl('', Validators.compose([
          Validators.required,
          Validators.pattern(regexValidators.password)
        ])
      )
    });

    // @ts-ignore
    this.user = JSON.parse(localStorage.getItem('user'));
    this.getDirection(this.user.employee.direction_id);
    this.getSup(this.user.employee.sup_id);
    this.getSuggestion();
    this.api.Users.get(this.user.id).subscribe((d:any) => {
      this.u = d;
    });
  }

  ngOnInit(): void {

  }

  getDirection(id:number){
    const opt = {
      _includes:'entity'
    };
    this.api.Managements.get(id,opt).subscribe((v:any)=>{
      this.direction = v.body;
    })
  }

  getSup(id:number){
    this.api.Employees.get(id).subscribe((v:any)=>{
      this.sup = v.body;
    })
  }

  getSuggestion(){
    const opt = {
      employee_id:this.user.employee.id,
      should_paginte:false,
      _sort:'created_at',
      _sortDir:'desc'
    };
    this.api.Suggestions.getList(opt).subscribe((d:any)=>{
      this.suggestions = d;
    })
  }

  saveSuggestion(){
    if(this.title!="" && this.contenu!=""){
      this.show_loading=true;
      const opt = {
        title:this.title,
        description:this.contenu,
        employee_id:this.user.employee.id
      };
      this.api.Suggestions.post(opt).subscribe((d:any)=>{
        this.openModal('Suggestion '+d.body.title+ ' enregistréée');
        console.log(d);
        this.suggestions.push(d.body);
        this.suggestions = _.orderBy(this.suggestions,'created_at').reverse();
        this.title = "";
        this.contenu="";
        this.show_loading=false;
      }, (e:any)=>{
        this.show = true;
        const x = this.api.handleError(e);
        this.titre_toast = x.title;
        this.message_toast = x.message;
        this.show_loading = false;
      })
    } else {
      this.show = true;
      this.titre_toast = "Champs vides";
      this.message_toast = "Merci de remplir tous les champs";
    }
  }

  deleteSuggestion(s:any){
    const x = _.find(this.suggestions,s);
    this.suggestions.splice(this.suggestions.indexOf(x),1);
    s.remove().subscribe((d:any)=>{
      this.openModal("Suggestion suppriméé");
    })
  }

  updatePassword(){
    const opt = {
      id:this.user.id,
      username : this.user.username,
      current_password : this.signupForm.value.current_password,
      password : this.signupForm.value.password,
      password_confirmation : this.signupForm.value.password_confirmation,
      has_reset_password:true
    };
    this.auth.update_info(opt).then((d:any)=>{
      console.log(d);
    })
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
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
