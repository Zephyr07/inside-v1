import { Component, OnInit } from '@angular/core';
import {AuthProvider} from "../../providers/auth/auth";
import {Router} from "@angular/router";

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss']
})
export class SidemenuComponent implements OnInit {
  public user:any;
  constructor(
    private auth: AuthProvider,
    private router: Router,
  ) {
    this.auth.getContext().then((d:any)=>{
      this.user = d;
    }, (e:any)=>{
      this.router.navigate(['/login']);
    });
  }

  ngOnInit(): void {
  }

  logout(){
    this.auth.logout().then(()=>{
      this.router.navigate(['/login']);
    })
  }
}
