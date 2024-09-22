import { Component } from '@angular/core';
import { User } from '../../../models/user';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/users/user.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-update-user',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.scss'
})
export class UpdateUserComponent {
  user: User | undefined;
  error: string = '';
  message: string = '';
  userForm ! : FormGroup;
  passwordForm! : FormGroup;
  constructor(private formBuilder: FormBuilder, private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.passwordForm = this.formBuilder.group(
      {
        currentPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required]],
        passwordConfirm: ['', [Validators.required]],
      }
      // ,
      // {
      //   validators: [Validation.match('newPassword', 'passwordConfirm')]
      // }
    );
    this.userForm = this.formBuilder.group(
      {
        nom_complet: ['', [Validators.required]],
        phone_number: ['', [Validators.required]]
      }
    );

    this.userService.getUser(this.user?.phone_number || "").subscribe({
      next: (data) => {
        if (data !== null) {
          this.user = data;
          this.initiazeForm();
        } else {
          this.user = undefined;
        }
      },
      error: (error) => {
        console.log(error.error.detail);
      }
    });
  
  }
  initiazeForm() {
    if (this.user) {
      this.userForm.patchValue({
        nom_complet: this.user.nom_complet,
        phone_number: this.user.phone_number,
      });
    }
  }

  togglePassword(input: HTMLInputElement) { // A mettre dans utils
    if (input.type === 'password') {
      input.type = 'text';
    } else {
      input.type = 'password';
    }
  }


  updateUser() {
    if (this.userForm.valid) {
      console.log("data : ", this.userForm.getRawValue())
      const [prenom, nom] = this.userForm.getRawValue().prenom_nom?.split(' ') || [];
      const { prenom_nom, ...rest } = this.userForm.getRawValue(); // Enlever prenom_nom
      const new_data = {
        ...rest,
        prenom,
        nom
      };
      console.log("data : ", new_data)
      // this.userService.updateUser(new_data).subscribe({
      //   next: (data) => {
      //     this.router.navigate(['profile/'])
      //   },
      //   error: (error) => {
      //     console.log('Erreur lors de la maj du user :', error.error.detail);
      //   }
      // });
    }
    else {
      this.userForm.markAllAsTouched();
    }
  }

  changePassword() {
    if (this.passwordForm.valid) {
      const currentPassword = this.passwordForm.getRawValue().currentPassword || '';
      const newPassword = this.passwordForm.getRawValue().newPassword || '';
      // this.userService.changePassword(currentPassword, newPassword).subscribe({
      //   next: (data) => {
      //     this.passwordForm.reset();
      //     this.message = "Le mot de passe est modifié avec succès";
      //   },
      //   error: (error) => {
      //     this.error = error.error[0]
      //     this.passwordForm.markAllAsTouched();
      //     this.message = ''
      //   }
      // })
    } else {
      this.passwordForm.markAllAsTouched();
      this.message = ''
    }
  }

}
