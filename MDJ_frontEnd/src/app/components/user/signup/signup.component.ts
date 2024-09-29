import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginComponent } from '../login/login.component';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../../services/users/user.service';
import Validation from '../../../shared/my-validators';
import { User } from '../../../models/user';


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,CommonModule,LoginComponent,RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit{
  InputType : string = 'password';
  SignupForm! : FormGroup;
  SignupError :string = '';
  otpCode: string = '';
  otpSent: boolean = false;
  isloading: boolean = false;
  user : User = {
    phone_number : "",
    nom_complet : "",
    slug : "",
  };

  fb = inject(FormBuilder);
  constructor(private userService : UserService,private router:Router){}

  ngOnInit(): void {

    this.SignupForm = this.fb.group(
      {
        nom_complet: ['', [Validators.required]],
        phone_number: ['', [Validators.required]],
        password: ['', [Validators.required]],
        password_confirm: ['', [Validators.required]],
      },
      {
        validators: [Validation.match('password', 'password_confirm')]
      }
    );
      
  }
 
  togglePassword(input: HTMLInputElement) {
    if (input.type === 'password') {
      input.type = 'text';
    } else {
      input.type = 'password';
    }
  }
  
  register():void{
    if(this.SignupForm.valid){
      this.isloading = true;
      let phone_number = this.SignupForm.getRawValue().phone_number || '';
      phone_number = phone_number.trim();
      if (!phone_number.startsWith('+221')) {
        phone_number = '+221' + phone_number;
      }
      const nom_complet = this.SignupForm.getRawValue().nom_complet || '';
      const password = this.SignupForm.getRawValue().password || '';
      this.userService.register({nom_complet:nom_complet,phone_number:phone_number,password:password}).subscribe({
        next: (data) => {
          this.otpSent = true;
          this.isloading = false;
        },
        error: (error) => {
          this.SignupError = error.error;
          // this.errorMessage = "Erreur lors de l'envoi du code OTP. Veuillez réessayer.";
        }
      })

    }else{
      this.SignupForm.markAllAsTouched();
    }
  }
 
  onVerifyOTP() {
    let phone_number = this.SignupForm.getRawValue().phone_number || '';
      phone_number = phone_number.trim();
      if (!phone_number.startsWith('+221')) {
        phone_number = '+221' + phone_number;
      }
    this.userService.verifyOTP(phone_number,this.otpCode).subscribe({
      next:(data)=>{
        this.router.navigate(['/login']);
      },
      error:(error)=>{
        // this.errorMessage = "Erreur lors de la vérification du code OTP. Veuillez réessayer.";
      }
  });
  }
}
