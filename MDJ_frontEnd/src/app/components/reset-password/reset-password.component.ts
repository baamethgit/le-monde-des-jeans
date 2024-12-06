// reset-password.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Validation from '../../shared/my-validators';
import { UserService } from '../../services/users/user.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit {
  step: 'email' | 'otp' | 'new-password' = 'email';
  email: string = '';
  otp: string = '';
  showPassword: boolean = false;
  isLoading: boolean = false;
  emailError: string = '';
  otpError: string = '';
  passwordForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initPasswordForm();
  }

  private initPasswordForm() {
    this.passwordForm = this.fb.group({
      newPassword: ['', [
        Validators.required
      ]],
      passwordConfirm: ['', Validators.required]
    }, {
      validators: [Validation.match('newPassword', 'passwordConfirm')]
    });
  }

  onEmailSubmitted() {
    if (!this.email) {
      this.emailError = "L'adresse email est requise";
      return;
    }
    
    this.isLoading = true;
    this.emailError = '';

    // Appel au service pour envoyer l'OTP par email
    this.userService.sendPasswordResetOTP(this.email).subscribe({
      next: () => {
        this.step = 'otp';
        this.isLoading = false;
      },
      error: (error) => {
        this.emailError = error.error.message || "Une erreur est survenue";
        this.isLoading = false;
      }
    });
  }

  onOtpSubmitted() {
    if (!this.otp) {
      this.otpError = "Le code de vérification est requis";
      return;
    }

    this.isLoading = true;
    this.otpError = '';

    this.userService.verifyPasswordResetOTP(this.email, this.otp).subscribe({
      next: () => {
        this.step = 'new-password';
        this.isLoading = false;
      },
      error: (error) => {
        this.otpError = error.error.message || "Code invalide";
        this.isLoading = false;
      }
    });
  }

  onPasswordChanged() {
    if (this.passwordForm.invalid) return;

    this.isLoading = true;
    const { newPassword } = this.passwordForm.value;

    this.userService.resetPassword(this.email, newPassword).subscribe({
      next: () => {
        // Rediriger vers la page de connexion avec un message de succès
        this.router.navigate(['/login'], {
          queryParams: { message: 'Mot de passe réinitialisé avec succès' }
        });
      },
      error: (error) => {
        console.error('Erreur lors de la réinitialisation du mot de passe:', error);
        this.isLoading = false;
      }
    });
  }
}