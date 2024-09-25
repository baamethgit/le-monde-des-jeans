import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  step: 'phone' | 'otp' | 'new-password' = 'phone';
  phone_number : string = '';
  otp : string = '';
  new_password : string = '';
  new_password_confirm : string = '';

  onPhoneSubmitted(phone: string) {
    // Logique pour envoyer l'OTP
    this.step = 'otp';
  }

  onOtpSubmitted(otp: string) {
    // Logique pour vérifier l'OTP
    this.step = 'new-password';
  }

  onPasswordChanged(newPassword: string) {
    // Logique pour mettre à jour le mot de passe
    // Rediriger vers la page de connexion ou le tableau de bord
  }
}
