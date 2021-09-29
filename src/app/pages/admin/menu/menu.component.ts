import { Component, OnInit } from '@angular/core';
import {AuthProvider} from "../../../providers/auth/auth";
import {NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  public user:any;
  public current_url = "";
  constructor(
    private auth: AuthProvider,
    private router: Router,
  ) {
    router.events.subscribe((val:any) => {
      // see also
      this.current_url = val.url;
    });
    this.auth.getContext().then((d:any)=>{
      this.user = d;
    }, (e:any)=>{
      this.router.navigate(['/login']);
    })
  }

  ngOnInit(): void {
    this.auth.storeSession();
  }

  logout(){
    this.auth.logout().then(()=>{
      this.router.navigate(['/login']);
    })
  }

}
