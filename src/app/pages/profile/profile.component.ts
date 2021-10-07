import {Component, Injectable, OnInit} from '@angular/core';
import {ApiProvider} from "../../providers/api/api";
import {ModalDismissReasons, NgbCalendar, NgbDatepickerI18n, NgbDateStruct, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import * as _ from "lodash";
import {AuthProvider} from "../../providers/auth/auth";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {regexValidators} from "../../services/regex";

const I18N_VALUES = {
  'fr': {
    weekdays: ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'],
    months: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aou', 'Sep', 'Oct', 'Nov', 'Déc'],
    weekLabel: 'sem'
  }
  // other languages you would support
};

// Define a service holding the language. You probably already have one if your app is i18ned. Or you could also
// use the Angular LOCALE_ID value
@Injectable()
export class I18n {
  language = 'fr';
}

// Define custom service providing the months and weekdays translations
@Injectable()
export class CustomDatepickerI18n extends NgbDatepickerI18n {
  constructor(private _i18n: I18n) { super(); }

  getWeekdayLabel(weekday: number): string { // @ts-ignore
    return I18N_VALUES[this._i18n.language].weekdays[weekday - 1]; }
  getWeekLabel(): string { // @ts-ignore
    return I18N_VALUES[this._i18n.language].weekLabel; }
  getMonthShortName(month: number): string { // @ts-ignore
    return I18N_VALUES[this._i18n.language].months[month - 1]; }
  getMonthFullName(month: number): string { return this.getMonthShortName(month); }
  getDayAriaLabel(date: NgbDateStruct): string { return `${date.day}-${date.month}-${date.year}`; }
}
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers:
    [I18n, {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}]  // define custom NgbDatepickerI18n provider
})
export class ProfileComponent implements OnInit {
  public u: any;
  public e: any;
  public employee: any ={};
  public user: any;
  public sup: any = {};
  public direction: any = {};
  public title = '';
  public contenu = '';
  public suggestions:any = [];
  public state = 'new_suggestion';
  public show = false;
  public show_bar = true;
  public show_loading = false;
  public today = this.calendar.getToday();
  public date:any;
  public titre_toast = "";
  public message_toast = "";
  public success_title = "";
  closeResult = '';
  public signupForm: FormGroup;
  public imageSrc ="";
  public images = new FormData();
  file_selected = false;


  constructor(
    private api:ApiProvider,
    private auth:AuthProvider,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
  private calendar: NgbCalendar
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
    this.show_bar = true;
    this.getDirection(this.user.employee.direction_id);
    this.getSup(this.user.employee.sup_id);
    this.getSuggestion();
    this.api.Users.get(this.user.id).subscribe((d:any) => {
      this.u = d;
      this.show_bar = false;
    });

    this.api.Employees.get(this.user.employee.id).subscribe((e:any)=>{
      this.e = e;
      this.imageSrc = e.body.image;
      this.employee = e.body;
      const x = this.employee.birthday.split(" ")[0];
      this.date = {
        year: parseInt(x.split("-")[0]),
        month: parseInt(x.split("-")[1]),
        day: parseInt(x.split("-")[2]),
      };
    })
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

  updateEmployee(){
    this.show_loading = true;
    this.e.first_name = this.employee.first_name;
    this.e.last_name = this.employee.last_name;
    this.e.phone = this.employee.phone;
    this.e.ip_phone = this.employee.ip_phone;
    this.e.location = this.employee.location;
    this.e.title = this.employee.title;
    this.e.location = this.employee.location;
    this.e.birthday = this.date.year+'-'+this.date.month+"-"+this.date.day+' 00:00:00';
    this.e.id = this.e.body.id;

    this.e.put().subscribe((e:any)=>{
      if(this.file_selected){
        // mise à jour de la photo
        this.images.append('_method', 'PUT');
        this.api.restangular.all('employees/' + e.body.id).customPOST(this.images, undefined, undefined, {'Content-Type': undefined}).subscribe((d:any) => {
          this.openModal("Vos informations ont été mise à jour");
          this.show_loading = false;
        }, (e:any)=>{
          console.log(e);
        })
      } else {
        this.openModal("Vos informations ont été mise à jour");
        this.show_loading = false;
      }
    })
  }

  onSelectImage(event:any) {
    this.file_selected = true;
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    //this.imageSrc = reader.result as string;
    this.images.append('image', event.target.files[0], event.target.files[0].name);
    reader.onload = () => {
      this.imageSrc = reader.result as string;
    };
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
