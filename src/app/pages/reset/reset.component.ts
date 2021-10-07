import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiProvider} from "../../providers/api/api";

import {CustomValidators} from '../../services/custom-validators';
@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent implements OnInit {
  public show = false;
  password: string = "";
  id: any;
  public user:any={};
  confirmPassword: string ="";
  public frmSignup: FormGroup;

  constructor(private api: ApiProvider, private router: Router, private route: ActivatedRoute, private fb: FormBuilder) {
    // @ts-ignore
    //this.id = this.router.getCurrentNavigation().extras.state.id;
    this.id = 68;
    this.api.Users.get(this.id).subscribe((d:any) => {
      console.log(d);
      this.user = d;
    });
    this.frmSignup = this.createSignupForm();
  }

  ngOnInit(): void {

  }

  validatePassword(pwd:any) {
    this.user.id = this.user.body.id;
    this.user.status = this.user.body.status;
    this.user.has_reset_password = true;
    this.user.type = 'user';
    this.user.password = pwd;
    this.user.put().subscribe((a:any) => {
      this.show = false;
      this.router.navigate(['/inside']);
    }, (q:any) => {
      console.log(q);
    });
  }

  createSignupForm(): FormGroup {
    return this.fb.group(
      {
        /*email: [
          null,
          Validators.compose([Validators.email, Validators.required])
        ],*/
        password: [
          null,
          Validators.compose([
            Validators.required,
            // check whether the entered password has a number
            CustomValidators.patternValidator(/\d/, {
              hasNumber: true
            }),
            // check whether the entered password has upper case letter
            CustomValidators.patternValidator(/[A-Z]/, {
              hasCapitalCase: true
            }),
            // check whether the entered password has a lower case letter
            CustomValidators.patternValidator(/[a-z]/, {
              hasSmallCase: true
            }),
            // check whether the entered password has a special character
            CustomValidators.patternValidator(
              /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
              {
                hasSpecialCharacters: true
              }
            ),
            Validators.minLength(8)
          ])
        ],
        confirmPassword: [null, Validators.compose([Validators.required])]
      },
      {
        // check whether our password and confirm password match
        validator: CustomValidators.passwordMatchValidator
      }
    );
  }

  submit() {
    this.show = true;
    // do signup or something
    this.validatePassword(this.frmSignup.value.password);
  }

}
