import { Component, OnInit } from '@angular/core';
import {ApiProvider} from "../../../../providers/api/api";
import {ActivatedRoute} from "@angular/router";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {regexValidators} from "../../../../services/regex";

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  public title = "Nouvel employé";
  public employees:any = [];
  public managements:any = [];
  private employee:any;
  public sup_id=2;
  public imageSrc ="";
  public direction_id=2;
  public userForm: FormGroup;
  public images = new FormData();
  public user = {
    username:'bvkoyo01',
    password:'',
    password_confirmation :'',
    employee: {
      first_name:'KOYOU',
      last_name:'Carine',
      phone:699581222,
      ip_phone:21000,
      title:'DAF',
      email:'ckoyou@bvssas.com',
      location:'Douala',
      direction_id:2,
      sup_id:2,
      user_id:0
    },
  };
  constructor(
    public route: ActivatedRoute,
    private api:ApiProvider,
    private formBuilder: FormBuilder,

  ) {
    this.userForm = this.formBuilder.group({
      username: new FormControl('bvkoyo01', Validators.compose([
          Validators.required,
        ])
      ),
      first_name: new FormControl('KOYOU', Validators.compose([
          Validators.required,
        ])
      ),
      last_name: new FormControl('Carine', Validators.compose([
          Validators.required,
        ])
      ),
      title: new FormControl('DAF', Validators.compose([
          Validators.required,
        ])
      ),
      phone: new FormControl('688998899', Validators.compose([
          Validators.required,
          Validators.pattern(regexValidators.phone)
        ])
      ),
      ip_phone: new FormControl('21000', Validators.compose([
          Validators.required,
          Validators.pattern(regexValidators.phone)
        ])
      ),
      location: new FormControl('Douala', Validators.compose([
          Validators.required
        ])
      ),
      email: new FormControl('ckoyou@bvssas.com', Validators.compose([
          Validators.required,
          Validators.pattern(regexValidators.email)
        ])
      )
    });

    const id:any = this.route.snapshot.paramMap.get('id');
    if(id !== undefined && id != null){
      this.getUser(parseInt(id));
      this.title = "Modification";
    }
  }

  ngOnInit(): void {
    this.getEmployees();
    this.getManagements();
  }

  saveUser(){
    if(this.employee !== undefined && this.employee != null){

    } else {
      // creation de l'utilisateur
      this.user.password = "password";
      this.user.password_confirmation = "password";
      this.user.username = this.userForm.value.username;
      this.api.Users.post(this.user).subscribe((d:any)=>{
        // creation de l'employé
        this.user.employee.user_id = d.body.id;
        this.user.employee.first_name = this.userForm.value.first_name;
        this.user.employee.last_name = this.userForm.value.last_name;
        this.user.employee.phone = this.userForm.value.phone;
        this.user.employee.ip_phone = this.userForm.value.ip_phone;
        this.user.employee.email = this.userForm.value.email;
        this.user.employee.title = this.userForm.value.title;
        this.user.employee.sup_id = this.sup_id;
        this.user.employee.direction_id = this.direction_id;
        this.user.employee.location = this.userForm.value.location;
        //console.log('user', this.user);
        this.api.Employees.post(this.user.employee).subscribe((e:any)=>{
          //console.log(e);
          // mise à jour de la photo
          this.images.append('_method', 'PUT');
          this.api.restangular.all('employees/' + e.body.id).customPOST(this.images, undefined, undefined, {'Content-Type': undefined}).subscribe((d:any) => {
            //console.log('ok', d);
            alert("employé créé");
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

  getEmployees(){
    const opt = {
      should_paginate : false,
      _sort:'first_name',
      _sortDir: 'asc'
    };
    this.api.Employees.getList(opt).subscribe((d:any)=>{
      this.employees = d;
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
    })
  }

  getUser(id:number){
    this.api.Users.get(id,{_includes:'employee'}).subscribe((d:any)=>{
      this.employee = d;
      this.user = d.body;
    })
  }

  onSelectImage(event:any) {
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    //this.imageSrc = reader.result as string;
    this.images.append('image', event.target.files[0], event.target.files[0].name);
    reader.onload = () => {
      this.imageSrc = reader.result as string;
    };
  }

}
