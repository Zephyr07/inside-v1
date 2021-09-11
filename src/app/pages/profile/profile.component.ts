import { Component, OnInit } from '@angular/core';
import {ApiProvider} from "../../providers/api/api";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public user: any;
  constructor(
    private api:ApiProvider
  ) {
    // @ts-ignore
    this.user = JSON.parse(localStorage.getItem('user'));
    this.getDirection(this.user.employee.direction_id);
    this.getSup(this.user.employee.sup_id);
  }

  ngOnInit(): void {
  }

  getDirection(id:number){
    const opt = {
      _includes:'entity'
    };
    this.api.Managements.get(id,opt).subscribe((v:any)=>{
      this.user.employee.direction = v.body;
    })
  }

  getSup(id:number){
    this.api.Employees.get(id).subscribe((v:any)=>{
      this.user.employee.sup = v.body;
    })
  }
}
