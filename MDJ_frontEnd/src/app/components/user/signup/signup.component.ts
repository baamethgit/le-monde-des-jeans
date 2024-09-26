import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginComponent } from '../login/login.component';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../../services/users/user.service';
import Validation from '../../../shared/my-validators';


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
      // {
      //   validators: [Validation.match('password', 'password_confirm')]
      // }
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
      let nom_complet = this.SignupForm.getRawValue().phone_number || '';
      let phone_number = this.SignupForm.getRawValue().phone_number || '';
      phone_number = phone_number.trim();
      if (!phone_number.startsWith('+221')) {
        phone_number = '+221' + phone_number;
      }
      let password = this.SignupForm.getRawValue().password || '';
      this.userService.register(nom_complet,phone_number,password).subscribe({
        next: (data) => {
          this.otpSent = true;
          
        },
        error: (error) => {
          this.SignupError = error.error.error;
          // this.errorMessage = "Erreur lors de l'envoi du code OTP. Veuillez réessayer.";
        }
      })

    }else{
      this.SignupForm.markAllAsTouched();
    }
  }

 
  onVerifyOTP() {
    this.userService.verifyOTP(this.otpCode).subscribe({
      next:(data)=>{
        console.log('Inscription réussie', data);
        this.router.navigate(['/login']);
      },
      error:(error)=>{
        // this.errorMessage = "Erreur lors de la vérification du code OTP. Veuillez réessayer.";
      }
  });
  }
}
