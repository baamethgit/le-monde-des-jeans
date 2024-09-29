import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Validation from '../../shared/my-validators';
import { UserService } from '../../services/users/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit{
  step: 'phone' | 'otp' | 'new-password' = 'new-password';
  phone_number : string = '';
  otp : string = '';
  passwordForm! : FormGroup;
  fb = inject(FormBuilder);
  userService = inject(UserService);
  user! : User;

  ngOnInit(): void {
    this.userService.getUser().subscribe({
      next: (data) => {
          this.user = data;
      },
      error: (error) => {
      }
    })
    this.passwordForm = this.fb.group(
      {
        newPassword: ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d@$!%*?&]{8,}$')]],
        passwordConfirm: ['', [Validators.required]],
      },
      {
        validators: [Validation.match('newPassword', 'passwordConfirm')]
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

  

  onPhoneSubmitted(phone: string) {
    // Logique pour envoyer l'OTP
    this.step = 'otp';
  }

  onOtpSubmitted(otp: string) {
    // Logique pour vérifier l'OTP
    this.step = 'new-password';
  }

  onPasswordChanged() {
    this.userService.updateUser(this.user).subscribe({
      next: (data) => {
        console.log("Mot de passe Réinitialisé");
      },
      error: (error) => {
        console.log("Réinitialisation échoué");
      }
    })
  }
  
}
