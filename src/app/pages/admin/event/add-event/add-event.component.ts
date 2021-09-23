import {Component, Injectable, OnInit} from '@angular/core';
import {ApiProvider} from "../../../../providers/api/api";
import {ActivatedRoute, Router} from "@angular/router";
import {ModalDismissReasons, NgbCalendar, NgbDatepickerI18n, NgbDateStruct, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import * as _ from "lodash";


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
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss'],
  providers:
    [I18n, {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}]  // define custom NgbDatepickerI18n provider
})
export class AddEventComponent implements OnInit {
  show = false;
  show_spinnner = false;
  show_loading = false;
  show_group = true;
  show_direction = true;
  show_entity = true;
  public message_toast = "";
  public success_title = "";
  closeResult = '';
  public titre ="Nouvel évènement";
  public title ="";
  public description ="";
  public location ="";
  public type ="event";
  private file_selected = false;
  public today = this.calendar.getToday();
  public date:any;
  public imageSrc ="";
  public fichier ="";
  public image = new FormData();
  public file = new FormData();
  public directions:any = [];
  public entities:any = [];
  public groups:any = [];
  public newsletter:any;
  constructor(
    private api: ApiProvider,
    public route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private calendar: NgbCalendar
  ) {
    const id:any = this.route.snapshot.paramMap.get('id');
    if(id !== undefined && id != null){
      this.getNewsletter(parseInt(id));
      this.show_spinnner = true;
      this.titre = "Modification";
    } else {
      this.getManagements();
      this.getEntities();
      this.getGroups();
    }
  }

  ngOnInit(): void {}

  saveNewsletter(){
    if(this.checkForm()){
      this.show_loading = true;
      if(this.newsletter!=null && this.newsletter!=undefined){
        // update
        this.newsletter.id = this.newsletter.body.id;
        this.newsletter.name = this.title;
        this.newsletter.description = this.description;
        this.newsletter.display_name = this.location;
        this.newsletter.date = this.date.year+'-'+this.date.month+"-"+this.date.day+' 00:00:00';
        this.newsletter.put().subscribe((n:any)=>{
          // traitement du fichier
          if(this.file_selected){
            // update du fichier
            this.image.append('_method', 'PUT');
            this.api.restangular.all('newsletters/' + n.body.id).customPOST(this.image, undefined, undefined, {'Content-Type': undefined}).subscribe((d:any) => {
              //console.log('ok', d);
              this.handleBelong(n);
              //this.openModal("Evènement "+this.title + " mis à jour");
            }, (e:any)=>{
              console.log(e);
            });
          } else {
            this.handleBelong(n);
          }
          // traitement des appartenance
        })
      } else {
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
          this.image.append('_method', 'PUT');
          this.api.restangular.all('newsletters/' + n.body.id).customPOST(this.image, undefined, undefined, {'Content-Type': undefined}).subscribe((d:any) => {
            //console.log('ok', d);
            this.openModal("Evènement "+this.title +" créé");
          }, (e:any)=>{
            console.log(e);
          });
          // affectation entité
          this.entities.forEach((e:any)=>{
            if(e.check){
              this.api.NewsletterEntities.post({entity_id:e.id,newsletter_id:n.body.id});
              e.check =false;
            }
          });
          // affectation direction
          this.directions.forEach((e:any)=>{
            if(e.check){
              this.api.NewsletterDirections.post({direction_id:e.id,newsletter_id:n.body.id});
              e.check =false;
            }
          });
          // affectation group
          this.groups.forEach((e:any)=>{
            if(e.check){
              this.api.NewsletterGroups.post({group_id:e.id,newsletter_id:n.body.id});
              e.check =false;
            }
          });

        })
      }
    }
  }

  handleBelong(n:any){
    // traitement des entities
    this.entities.forEach((v:any)=>{
      // ajout
      if(v.check){
        // verification si l'entitié n'est pas déjà membre
        if(_.find(this.newsletter.body.newsletter_entities,{entity_id:v.id})== undefined) {
          this.api.NewsletterEntities.post({entity_id:v.id,newsletter_id:n.body.id}).subscribe(()=>{
            console.log("entitié", v.id, 'créé');
          }, (e:any)=>{
            console.log(e);
          })
        }

      } else {
        // suppremssion
        const x = _.find(this.newsletter.body.newsletter_entities,{entity_id:v.id});
        if(x!=undefined){
          this.api.NewsletterEntities.get(x.id).subscribe((a:any)=>{
            a.id = a.body.id;
            a.remove().subscribe((b:any)=>{
              console.log(b);
            }, (e:any)=>{
              console.log(e);
            })
          })
        }
      }
    });
    // traitement des direction
    this.directions.forEach((v:any)=>{
      // ajout
      if(v.check){
        // verification si l'entitié n'est pas déjà membre
        if(_.find(this.newsletter.body.newsletter_directions,{direction_id:v.id})== undefined) {
          this.api.NewsletterDirections.post({direction_id:v.id,newsletter_id:n.body.id}).subscribe(()=>{
            console.log("direction", v.id, 'créé');
          }, (e:any)=>{
            console.log(e);
          })
        }

      } else {
        // suppremssion
        const x = _.find(this.newsletter.body.newsletter_directions,{direction_id:v.id});
        if(x!=undefined){
          this.api.NewsletterDirections.get(x.id).subscribe((a:any)=>{
            a.id = a.body.id;
            a.remove().subscribe((b:any)=>{
              console.log(b);
            }, (e:any)=>{
              console.log(e);
            })
          })
        }
      }
    });
    // traitement des group
    this.groups.forEach((v:any)=>{
      // ajout
      if(v.check){
        // verification si l'entitié n'est pas déjà membre
        if(_.find(this.newsletter.body.newsletter_groups,{group_id:v.id})== undefined) {
          this.api.NewsletterGroups.post({group_id:v.id,newsletter_id:n.body.id}).subscribe(()=>{
            console.log("group", v.id, 'créé');
          }, (e:any)=>{
            console.log(e);
          })
        }

      } else {
        // suppremssion
        const x = _.find(this.newsletter.body.newsletter_groups,{group_id:v.id});
        if(x!=undefined){
          this.api.NewsletterGroups.get(x.id).subscribe((a:any)=>{
            a.id = a.body.id;
            a.remove().subscribe((b:any)=>{
              console.log(b);
            }, (e:any)=>{
              console.log(e);
            })
          })
        }
      }
    });
    this.openModal("Evènement "+this.title + " mis à jour");
  }

  getNewsletter(id:number){
    const opt = {
      _includes: "newsletter_directions.direction,newsletter_groups.group,newsletter_entities.entity"
    };
    this.api.Newsletters.get(id,opt).subscribe((d:any)=>{
      this.newsletter = d;
      this.title = d.body.title;
      this.description = d.body.description;
      this.location = d.body.location;
      this.imageSrc = d.body.image;
      const x = d.body.date.split(" ")[0];
      this.date = {
        year: parseInt(x.split("-")[0]),
        month: parseInt(x.split("-")[1]),
        day: parseInt(x.split("-")[2]),
      };
      this.show_spinnner = false;
      this.getManagements();
      this.getEntities();
      this.getGroups();
    })
  }

  getManagements(){
    const opt = {
      should_paginate : false,
      _sort:'name',
      _sortDir: 'asc'
    };
    this.api.Managements.getList(opt).subscribe((d:any)=>{
      this.directions = d;
      const id:any = this.route.snapshot.paramMap.get('id');
      this.show_direction = false;
      if(id !== undefined && id != null){
        this.newsletter.body.newsletter_directions.forEach((v:any)=>{
          if(_.find(this.directions,{id:v.direction_id})!= undefined) {
            let x = _.find(this.directions,{id:v.direction_id});
            x.check = true;
            x.checked = true;
          }
        });
      }
    }, (e:any)=>{
      console.log(e);
    })
  }

  getGroups(){
    const opt = {
      should_paginate : false,
      _sort:'name',
      _sortDir: 'asc'
    };
    this.api.Groups.getList(opt).subscribe((d:any)=>{
      this.groups = d;
      const id:any = this.route.snapshot.paramMap.get('id');
      this.show_group = false;
      if(id !== undefined && id != null){
        this.newsletter.body.newsletter_groups.forEach((v:any)=>{
          if(_.find(this.groups,{id:v.group_id})!= undefined) {
            let x = _.find(this.groups,{id:v.group_id});
            x.check = true;
            x.checked = true;
          }
        });
      }
    }, (e:any)=>{
      console.log(e);
    })
  }

  getEntities(){
    const opt = {
      should_paginate : false,
      _sort:'name',
      _sortDir: 'asc'
    };
    this.api.Entities.getList(opt).subscribe((d:any)=>{
      this.entities = d;
      this.show_entity = false;
      const id:any = this.route.snapshot.paramMap.get('id');
      if(id !== undefined && id != null){
        this.newsletter.body.newsletter_entities.forEach((v:any)=>{
          if(_.find(this.entities,{id:v.entity_id})!= undefined) {
            let x = _.find(this.entities,{id:v.entity_id});
            x.check = true;
            x.checked = true;
          }
        });
      }
    }, (e:any)=>{
      console.log(e);
    })
  }

  test(e:any){
    e.check = !e.check;
  }

  onSelectFile(event:any) {
    this.file_selected = true;
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    //this.imageSrc = reader.result as string;
    this.image.append('image', event.target.files[0], event.target.files[0].name);
    reader.onload = () => {
      this.imageSrc = reader.result as string;
    };
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
    } else if(this.location==undefined || this.location==null || this.location==""){
      this.message_toast = "Lieu absent";
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
    this.router.navigate(['/admin/list-event']);
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
