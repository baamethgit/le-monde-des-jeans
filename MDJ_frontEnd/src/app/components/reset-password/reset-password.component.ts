// reset-password.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
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
  email: string = '';
  showPassword: boolean = false;
  isLoading: boolean = false;
  passwordForm!: FormGroup;
  error = "";
  token :string | null = null;
  constructor(
<<<<<<< HEAD
    private readonly fb: FormBuilder,
    private readonly userService: UserService,
    private readonly router: Router
=======
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
>>>>>>> 9b3677841ef8f6c50420a767ed20a12d34ebf9d1
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (!this.token){
      this.router.navigate(['/**']);
    }
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


  onPasswordChanged() {
    if (this.passwordForm.invalid) {
     this.passwordForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    const newPassword = this.passwordForm.getRawValue().newPassword;

    this.userService.resetPassword(newPassword,this.token || '').subscribe({
      next: () => {
<<<<<<< HEAD
        // Rediriger vers la page de connexion avec un message de succès
        this.router.navigate(['/login'], {
          queryParams: { message: 'Mot de passe réinitialisé avec succès' }
        });
=======
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.error = error.error.error
        this.isLoading = false;
>>>>>>> 9b3677841ef8f6c50420a767ed20a12d34ebf9d1
      }
    });
  }
}
