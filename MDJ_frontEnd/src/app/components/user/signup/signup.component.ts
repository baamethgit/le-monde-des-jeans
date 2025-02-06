import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginComponent } from '../login/login.component';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../../services/users/user.service';
import Validation from '../../../shared/my-validators';
import { User } from '../../../models/user';
import {finalize} from "rxjs";
import { CustomValidators } from './custom-validator';


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
  msgCreation = "";
  isloading: boolean = false;
  user : User = {
    phone_number : "",
    nom_complet : "",
    addresse_mail:"",
    slug : "",
  };

  fb = inject(FormBuilder);
  constructor(private userService : UserService,private router:Router){}

  ngOnInit(): void {

    this.SignupForm = this.fb.group(
      {
        nom_complet: ['', [Validators.required]],
        phone_number: ['', [Validators.required]],
       //addresse_mail:['',[Validators.required, Validators.email,CustomValidators.emailDomain()]],
        addresse_mail:['',[Validators.email]],
        password: ['', [Validators.required]],
        password_confirm: ['', [Validators.required]],
      },
      {
        validators: [Validation.match('password', 'password_confirm'),
                      Validation.phoneNumberValidation('phone_number'),
        ],
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
      const addresse_mail = this.SignupForm.getRawValue().addresse_mail || '';
      this.userService.register({nom_complet:nom_complet,phone_number:phone_number,password:password,addresse_mail:addresse_mail})
        .pipe(
          finalize(() => {
            this.isloading = false;
          })
        )
        .subscribe({
        next: (data) => {
          //this.msgCreation = data.message
          //this.msgCreation = "Contacter l'admin pour activer votre Compte"
          //alert(this.msgCreation);
          this.router.navigate(['login']);
        },
        error: (error) => {

          this.SignupError = error.error.erreur_rencontre;
        }
      })

    }else{
      this.SignupForm.markAllAsTouched();
    }
  }

}
