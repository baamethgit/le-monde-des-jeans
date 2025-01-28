import {CommonModule, isPlatformServer} from '@angular/common';
import {Component, Inject, OnInit, PLATFORM_ID, signal} from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../../services/users/user.service';
import { User } from '../../../models/user';
import Validation from "../../../shared/my-validators";
import {finalize} from "rxjs";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
  InputType : string = 'password';
  loginForm! : FormGroup;
  loginError : boolean = false;
  identifiantsError = "";
  isLoading = false;

  isServer = false;

  constructor(@Inject(PLATFORM_ID) platformId: Object,private userService:UserService,private fb:FormBuilder,private router:Router){
    this.isServer = isPlatformServer(platformId);

  }

  ngOnInit(): void {

      this.loginForm = this.fb.group(
        {
          phone_number: ['', [Validators.required]],
          password: ['', [Validators.required]],
        },
        {
          validators: [Validation.phoneNumberValidation('phone_number')]
        }
      );
    }

    loginUser():void{
    this.loginError=false;
    this.identifiantsError = '';
      if(this.loginForm.valid){
        let phone_number = this.loginForm.getRawValue().phone_number || '';
        phone_number = phone_number.trim();
        if (!phone_number.startsWith('+221')) {
          phone_number = '+221' + phone_number;
        }
        let password = this.loginForm.getRawValue().password || '';
        this.isLoading = true;
        this.userService.login(phone_number,password)
          .pipe(
            finalize(
              ()=>{
                this.isLoading = false;
              }
            )
          )
          .subscribe({
          next: (user) => {
            this.router.navigate(["/"]);
          },
          error: (error) => {
            this.loginForm.markAllAsTouched();
            if (error.error.error_identifiants){
              this.identifiantsError = error.error.error_identifiants
            }else {
              this.loginError = true;
            }
          }
        })
      }else{
        this.loginForm.markAllAsTouched();
      }
    }

    togglePassword(){
      if (this.InputType == 'password'){
        this.InputType = 'text';
      }else{
        this.InputType = 'password';
      }
    }
}
