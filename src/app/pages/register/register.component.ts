import { Component, OnInit } from '@angular/core';
import {AuthProvider} from "../../providers/auth/auth";
import {ApiProvider} from "../../providers/api/api";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public phone = 690613323;
  public password = "T@rija690";
  public password_confirmation = "T@rija690";
  constructor(
    private router: Router,
    private api: ApiProvider,
    private auth: AuthProvider,
  ) { }

  ngOnInit(): void {
  }
  register() {
    // creation de l'utilisateur
    const user = {
      phone:this.phone,
      password:this.password,
      password_confirmation:this.password_confirmation,
    };
    this.auth.register(user).then((rep: any) => {
      console.log(rep);
      this.router.navigate(['/inside']);
    }).catch((err) => {
      console.log(err)
    });
  }
}
