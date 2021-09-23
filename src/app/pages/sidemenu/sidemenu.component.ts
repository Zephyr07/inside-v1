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
