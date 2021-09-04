import { Component, OnInit } from '@angular/core';
import {ApiProvider} from "../../../../providers/api/api";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthProvider} from "../../../../providers/auth/auth";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  public message_toast = "";
  file_selected = false;
  show = false;
  show_spinnner = false;
  show_loading = false;
  show_direction = true;
  show_employee = true;
  closeResult = '';
  public success_title = "";
  public titre = "Nouvel employé";
  public user:any;
  public employees:any = [];
  public managements:any = [];
  public username = "";
  public email = "";
  public first_name = "";
  public last_name = "";
  public title = "";
  public phone = 0;
  public ip_phone = 0;
  public location = "";
  public sup_id=1;
  public imageSrc ="";
  public birthday:any;
  public today = new Date();
  public direction_id=1;
  public images = new FormData();
  constructor(
    public route: ActivatedRoute,
    public router: Router,
    private modalService: NgbModal,
    private api:ApiProvider,

  ) {
    const id:any = this.route.snapshot.paramMap.get('id');
    if(id !== undefined && id != null){
      this.titre = "Modification";
      this.show_spinnner = true;
      this.getUser(parseInt(id));
    } else {
      this.getEmployees();
      this.getManagements();
    }
  }

  ngOnInit(): void {
  }

  saveUser(){
    if(this.checkForm()){
      this.show_loading = true;
      if(this.user != undefined && this.user != null){
        console.log(this.user);
        if(this.user.body.username != this.username){
          this.user.username = this.username;
          this.user.put().subscribe((u:any)=>{
            console.log('user update',u.body.username);
            this.updateEmployee(this.user.body.employee.id);
          }, (e:any)=>{
            console.log("erreur",e);
          })
        } else {
          this.updateEmployee(this.user.body.employee.id);
        }

      } else {
        console.log("aze");
        // creation de l'utilisateur
        const user = {
          password:"password",
          password_confirmation:"password",
          username:this.username,
        };
        this.api.Users.post(user).subscribe((d:any)=>{
          // creation de l'employé
          const employee = {
            user_id : d.body.id,
            first_name : this.first_name,
            last_name : this.last_name,
            phone : this.phone,
            ip_phone : this.ip_phone,
            email : this.email,
            title : this.title,
            birthday:this.birthday.year+'-'+this.birthday.month+"-"+this.birthday.day+' 00:00:00',
            sup_id : this.sup_id,
            direction_id : this.direction_id,
            location : this.location
          };
          //console.log('user', this.user);
          this.api.Employees.post(employee).subscribe((e:any)=>{
            //console.log(e);
            // mise à jour de la photo
            this.images.append('_method', 'PUT');
            this.api.restangular.all('employees/' + e.body.id).customPOST(this.images, undefined, undefined, {'Content-Type': undefined}).subscribe((d:any) => {
              //console.log('ok', d);
               }, (e:any)=>{
              console.log(e);
            })
          }, (e:any)=>{
            console.log(e);
          })
        }, (e:any)=>{
          console.log(e);
        })
      }
    }
  }

  getEmployees(){
    const opt = {
      should_paginate : false,
      _sort:'first_name',
      _sortDir: 'asc'
    };
    this.api.Employees.getList(opt).subscribe((d:any)=>{
      this.employees = d;
      this.show_employee = false;
    })
  }

  getManagements(){
    const opt = {
      should_paginate : false,
      _sort:'name',
      _sortDir: 'asc'
    };
    this.api.Managements.getList(opt).subscribe((d:any)=>{
      this.managements = d;
      this.show_direction = false;
    })
  }

  getUser(id:number){
    this.api.Users.get(id,{_includes:'employee'}).subscribe((d:any)=>{
      console.log(d);
      this.user = d;
      this.user.id = d.body.id;
      this.username = d.body.username;
      this.first_name = d.body.employee.first_name;
      this.last_name = d.body.employee.last_name;
      this.phone = d.body.employee.phone;
      this.title = d.body.employee.title;
      this.ip_phone = d.body.employee.ip_phone;
      this.email = d.body.employee.email;
      this.imageSrc = d.body.employee.image;
      const x = d.body.employee.birthday.split(" ")[0];
      this.birthday = {
        year: parseInt(x.split("-")[0]),
        month: parseInt(x.split("-")[1]),
        day: parseInt(x.split("-")[2]),
      };
      this.location = d.body.employee.location;
      this.direction_id = d.body.employee.direction_id;
      this.sup_id = d.body.employee.sup_id;
      this.show_spinnner = false;
      this.getEmployees();
      this.getManagements();
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


  checkForm() {
    if(this.title==undefined || this.title==null || this.title==""){
      this.message_toast = "Poste absent";
      this.show = true;
      return false;
    } else if(this.birthday==undefined || this.birthday==null || this.birthday == ""){
      this.message_toast = "Date d'anniversaire absente";
      this.show = true;
      return false;
    } else if(this.username==undefined || this.username==null || this.username==""){
      this.message_toast = "Nom d'utilisateur absent";
      this.show = true;
      return false;
    } else if(this.first_name==undefined || this.first_name==null || this.first_name==""){
      this.message_toast = "Nom absent";
      this.show = true;
      return false;
    } else if(this.email==undefined || this.email==null || this.email==""){
      this.message_toast = "Email absent";
      this.show = true;
      return false;
    } else if(this.phone==undefined || this.phone==null || this.phone==0){
      this.message_toast = "Téléphone absent";
      this.show = true;
      return false;
    } else if(this.direction_id==undefined || this.direction_id==null || this.direction_id==0){
      this.message_toast = "Direction absente";
      this.show = true;
      return false;
    } else if(this.location==undefined || this.location==null || this.location==""){
      this.message_toast = "Ville absente";
      this.show = true;
      return false;
    } else {
      this.show = false;
      return true;
    }
  }

  updateEmployee(id:number){
    this.api.Employees.get(id).subscribe((e:any)=>{
      e.id = e.body.id;
      e.first_name = this.first_name;
      e.last_name = this.last_name;
      e.phone = this.phone;
      e.ip_phone = this.ip_phone;
      e.email = this.email;
      e.name = this.title;
      e.birthday=this.birthday.year+'-'+this.birthday.month+"-"+this.birthday.day+' 00:00:00';
      e.sup_id = this.sup_id;
      e.direction_id = this.direction_id;
      e.display_name = this.location;
      e.put().subscribe((d:any)=>{
        console.log('employee update',d.body.first_name);
        // changement de l'image
        if(this.file_selected){
          this.images.append('_method', 'PUT');
          this.api.restangular.all('employees/' + d.body.id).customPOST(this.images, undefined, undefined, {'Content-Type': undefined}).subscribe(() => {
            //console.log('ok', d);
            this.openModal("Employé "+this.first_name + " "+ this.last_name +" mise à jour");
            this.show_loading = true;
          }, (e:any)=>{
            console.log(e);
          });
        } else {
          alert("Employé mise à jour");
          this.show_loading = true;
          this.openModal("Employé "+this.first_name + " "+ this.last_name +" mise à jour");
        }
      })
    }, (e:any)=>{
      console.log("erreur",e);
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
    this.router.navigate(['/admin/list-user']);
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
