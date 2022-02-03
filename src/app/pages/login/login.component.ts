import { Component, OnInit } from '@angular/core';
import {NavigationExtras, Router} from "@angular/router";
import {ApiProvider} from "../../providers/api/api";
import {AuthProvider} from "../../providers/auth/auth";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public phone : number;
  public password = "";
  public show = false;
  constructor(
    private router: Router,
    private api: ApiProvider,
    private auth: AuthProvider,
  ) {
    this.phone = 690404180;
  }

  ngOnInit(): void {
  }

  login(){
    this.show = true;
    if (this.phone === 0 && this.password === '') {
      this.show = false;
      alert('Téléphone et mot de passe absents');
    } else if (this.phone === 0 ) {
      this.show = false;
      alert('Téléphone absent');
    } else if ( this.password === '') {
      this.show = false;
      alert('Mot de passe absent');
    } else {
      this.auth.login({phone: this.phone, password: this.password}).then((rep:any) => {
        if (!rep.user.has_reset_password) {
          const navigationExtra: NavigationExtras = {state: {id: rep.user.id}};
          this.router.navigate(['reset'],navigationExtra);
        } else {
          this.router.navigate(['/inside']);
        }

      }).catch((err) => {
        // console(err);
        this.show = false;
        if (err.data.status_code === 401) {
          alert('Email ou mot de passe incorrect');
        } else {
          alert('login : Service temporairement indisponible, Merci de réessayer dans quelques minutes.');
        }
      });
    }
  }
}
