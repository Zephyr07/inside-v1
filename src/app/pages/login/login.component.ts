import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {ApiProvider} from "../../providers/api/api";
import {AuthProvider} from "../../providers/auth/auth";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public username = "";
  public password = "";
  constructor(
    private router: Router,
    private api: ApiProvider,
    private auth: AuthProvider,
  ) { }

  ngOnInit(): void {
  }

  login(){
    if (this.username === '' && this.password === '') {
      //Metro.notify.create('Identifiant et mot de passe absents', 'Erreur de connexion', {cls: 'alert'});
    } else if (this.username === '' ) {
      //Metro.notify.create('Identifiant absent', 'Erreur de connexion', {cls: 'warning'});
    } else if ( this.password === '') {
      //Metro.notify.create('Mot de passe absent', 'Erreur de connexion', {cls: 'warning'});
    } else {
      this.auth.login({username: this.username, password: this.password}).then((rep:any) => {
        this.router.navigate(['/inside']);
      }).catch((err) => {
        // console(err);
        if (err.data.status_code === 401) {
          //Metro.notify.create('Email ou mot de passe incorrect', 'Echec de connexion', {cls: 'alert'});
        } else {
          //Metro.notify.create('login : Service temporairement indisponible, Merci de réessayer dans quelques minutes.', 'Erreur Login ' + err.data.error.status_code, {cls: 'alert', keepOpen: true, width: 300});
        }
      });
    }
  }
}
