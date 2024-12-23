import { Component } from '@angular/core';
import { User } from '../../../models/user';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../services/users/user.service';
import { Router } from '@angular/router';
import Validation from '../../../shared/my-validators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profil-update',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './profil-update.component.html',
  styleUrl: './profil-update.component.scss'
})
export class ProfilUpdateComponent {
  user!: User;
  error: string = '';
  updateError: string = '';
  changePasswordError: string = '';
  message: string = '';
  userForm ! : FormGroup;
  passwordForm! : FormGroup;


  constructor(private formBuilder: FormBuilder, private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.userForm = this.formBuilder.group(
      {
        nom_complet: ['', [Validators.required,Validators.minLength(5)]],
        phone_number: ['', [Validators.required]],
      },
      {
        validators: [Validation.phoneNumberValidation('phone_number')]
      }

    );
    this.userService.getUser().subscribe({
      next: (data) => {
        if (data !== null) {
          this.user = data;
          this.initiazeForm();
        } else {
          this.router.navigate(['login']);
        }
      },
      error: (error) => {
        this.router.navigate(['login']);
      }
    });

   

    this.passwordForm = this.formBuilder.group(
      {
        currentPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required]],
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

  initiazeForm() {
    if (this.user) {
      this.userForm.patchValue({
        nom_complet: this.user.nom_complet,
        phone_number: this.user.phone_number
      });
    }
  }

  updateUser() {
    if (this.userForm.valid) {
      this.user.nom_complet = this.userForm.getRawValue().nom_complet;
      this.user.phone_number = this.userForm.getRawValue().phone_number;
      this.userService.updateUser(this.user).subscribe({
        next: (data) => {
          this.router.navigate(['/profile']);
          this.updateError = "";
        },
        error: (error) => {
          this.updateError = "Erreur lors de la maj du user";
        }
      });
    }
    else {
      this.userForm.markAllAsTouched();
    }
  }

  changePassword() {
    if (this.passwordForm.valid) {
      const currentPassword = this.passwordForm.getRawValue().currentPassword || '';
      const newPassword = this.passwordForm.getRawValue().newPassword || '';
      this.userService.changePassword(currentPassword, newPassword).subscribe({
        next: (data) => {
          this.passwordForm.reset();
          this.message = "Le mot de passe est modifié avec succès";
          this.changePasswordError = '';
        },
        error: (error) => {
          this.error = error.error[0]
          this.passwordForm.markAllAsTouched();
          this.message = '';
          this.changePasswordError = "Erreur lors du changement de mot de passe";
        }
      })
    } else {
      this.passwordForm.markAllAsTouched();
      this.message = ''
    }
  }

  resetProfileForm():void{
    this.initiazeForm();
  }

  resetPasswordForm():void{
    this.passwordForm.reset();
  }
}
