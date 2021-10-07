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
  public query = "";
  public show_search = true;
  constructor(
    private auth: AuthProvider,
    private router: Router,
  ) {
    router.events.subscribe((val:any) => {
      // see also
      this.current_url = val.url;
      if(val.url!=undefined && val.url.substring(0,14) =='/inside/search'){
        this.show_search = false;
      } else {
        this.show_search = true;
      }
    });
    this.auth.getContext().then((d:any)=>{
      this.user = d;
    }, (e:any)=>{
      this.router.navigate(['/login']);
    });
  }

  ngOnInit(): void {
    this.auth.storeSession();
  }

  search(){
    if(this.query!="" && this.query.length>3){
      this.router.navigate(['/inside/search/'+this.query]);
    } else {
      alert("Il faut minimum 3 caractères pour lancer la recherche");
    }
  }

  logout(){
    this.auth.logout().then(()=>{
      this.router.navigate(['/login']);
    })
  }
}
