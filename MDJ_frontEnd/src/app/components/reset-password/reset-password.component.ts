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
    private readonly fb: FormBuilder,
    private readonly userService: UserService,
    private readonly router: Router,
    private route: ActivatedRoute,
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

        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.error = error.error.error
        this.isLoading = false;
      }
    });
  }
}
