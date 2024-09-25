import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../services/users/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
  InputType : string = 'password';
  loginForm! : FormGroup;
  loginError :string = '';

  constructor(private userService:UserService,private fb:FormBuilder,private router:Router){}

  ngOnInit(): void {
      this.loginForm = this.fb.group(
        {
          phone_number: ['', [Validators.required]],
          password: ['', [Validators.required]],
        },
        {
          // validators: [Validation.mailValidation('courriel')]
        }
      );
    }

    loginUser():void{
      if(this.loginForm.valid){
        let phone_number = this.loginForm.getRawValue().phone_number || '';
        let password = this.loginForm.getRawValue().password || '';
        this.userService.login(phone_number,password).subscribe({
          next: (data) => {
            window.location.reload();
            this.router.navigateByUrl('/');
          },
          error: (error) => {
            this.loginError = error.error.detail;
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
