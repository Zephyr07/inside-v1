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
  public username = "bvnand01";
  public password = "password";
  public show = false;
  constructor(
    private router: Router,
    private api: ApiProvider,
    private auth: AuthProvider,
  ) { }

  ngOnInit(): void {
  }

  login(){
    this.show = true;
    if (this.username === '' && this.password === '') {
      this.show = false;
      alert('Identifiant et mot de passe absents');
    } else if (this.username === '' ) {
      this.show = false;
      alert('Identifiant absent');
    } else if ( this.password === '') {
      this.show = false;
      alert('Mot de passe absent');
    } else {
      this.auth.login({username: this.username, password: this.password}).then((rep:any) => {
        this.router.navigate(['/inside']);
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
