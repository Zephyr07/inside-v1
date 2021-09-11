import {Component, Injectable, OnInit} from '@angular/core';
import {ApiProvider} from "../../providers/api/api";
import {ModalDismissReasons, NgbCalendar, NgbDatepickerI18n, NgbDateStruct, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import * as _ from "lodash";
import {DomSanitizer} from "@angular/platform-browser";

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
  selector: 'app-groupe',
  templateUrl: './groupe.component.html',
  styleUrls: ['./groupe.component.scss'],
  providers:
    [I18n, {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}]  // define custom NgbDatepickerI18n provider
})
export class GroupeComponent implements OnInit {
  public user:any;
  public group:any =[];
  public note:any =[];
  public title ="";
  public description ="";
  public location ="";
  public type ="event";
  public message_toast = "";
  private file_selected = false;
  public today = this.calendar.getToday();
  public date:any;
  public imageSrc ="";
  public fichier ="";
  public image = new FormData();
  public file = new FormData();
  public show_group = true;
  public show = false;
  public show_loading = false;
  closeResult = '';
  public search_text = "";
  public state = "description";
  public detail : any;
  public news : any;
  public newsletter:any;
  constructor(
    private modalService: NgbModal,
    private sanitizer: DomSanitizer,
    private calendar: NgbCalendar,
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
      d.forEach((v:any)=>{
        const x = _.find(v.members,{profile:'owner'});
        v.owner = !!(x.employee_id = this.user.employee.id);
      });
      this.group = d;
      this.show_group = false;
    })
  }

  getNote(id:any){
    // recupération des notes du groupe d'appartenance
    let opt = {
      should_paginate: false,
      _sort:'updated_at',
      group_id: id,
      _includes: 'newsletter'
    };
    this.api.NewsletterGroups.getList(opt).subscribe((e:any)=>{
      this.note = e;
    }, (e:any)=>{
      console.log(e);
    })
  }

  saveNewsletter(){
    if(this.checkForm()){
      this.show_loading = true;
      // creation
      const opt = {
        title:this.title,
        type:this.type,
        description:this.description,
        location:this.location,
        date:this.date.year+'-'+this.date.month+"-"+this.date.day+' 00:00:00'
      };
      this.api.Newsletters.post(opt).subscribe((n:any)=>{
        // enregistremnt du fichier
        if(this.type == 'event'){
          this.image.append('_method', 'PUT');
          this.api.restangular.all('newsletters/' + n.body.id).customPOST(this.image, undefined, undefined, {'Content-Type': undefined}).subscribe((d:any) => {
            this.api.NewsletterGroups.post({group_id:this.detail.id,newsletter_id:n.body.id});
            alert("Evènement "+this.title +" créé");
            this.reset();
          }, (e:any)=>{
            console.log(e);
          });
        } else {
          this.file.append('_method', 'PUT');
          this.api.restangular.all('newsletters/' + n.body.id).customPOST(this.file, undefined, undefined, {'Content-Type': undefined}).subscribe((d:any) => {
            //console.log('ok', d);
            this.api.NewsletterGroups.post({group_id:this.detail.id,newsletter_id:n.body.id});
            alert("Note "+this.title + " créée");
            this.reset();
          }, (e:any)=>{
            console.log(e);
          });
        }

      })
    }
  }

  onSelectImage(event:any) {
    this.file_selected = true;
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    //this.imageSrc = reader.result as string;
    this.image.append('image', event.target.files[0], event.target.files[0].name);
    reader.onload = () => {
      this.imageSrc = reader.result as string;
    };
  }

  onSelectFile(event:any) {
    this.file_selected = true;
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    //this.imageSrc = reader.result as string;
    this.file.append('file', event.target.files[0], event.target.files[0].name);
    /*reader.onload = () => {
      this.fichier = reader.result as string;
    };*/
  }
  
  reset(){
    this.title ="";
    this.description ="";
    this.location ="";
    this.type ="event";
    this.message_toast = "";
    this.file_selected = false;
    this.today = this.calendar.getToday();
    this.imageSrc ="";
    this.fichier ="";
    this.image = new FormData();
    this.file = new FormData();
    this.show_loading = false;
  }

  checkForm() {
    if(this.title==undefined || this.title==null || this.title==""){
      this.message_toast = "Titre absent";
      this.show = true;
      return false;
    } else if(this.date==undefined || this.date==null || this.date == ""){
      this.message_toast = "Date absente";
      this.show = true;
      return false;
    } else if(this.description==undefined || this.description==null || this.description==""){
      this.message_toast = "Description absente";
      this.show = true;
      return false;
    } else if(this.type == 'event' && (this.location==undefined || this.location==null || this.location=="")){
      this.message_toast = "Lieu absent";
      this.show = true;
      return false;
    } else {
      this.show = false;
      return true;
    }
  }

  openModal(n:any){
    this.state = 'description';
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

  openModal3(){
    // modal de creation d'un evènement
    // @ts-ignore
    document.getElementById('btnModal3').click();
  }

}
