import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {UserService} from "../../services/users/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-initresetpasswd',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './initresetpasswd.component.html',
  styleUrl: './initresetpasswd.component.scss'
})
export class InitresetpasswdComponent implements OnInit{
  email: string = '';
  isLoading: boolean = false;
  emailError: string = '';
  msg = false;

  constructor(
    private userService: UserService,
  ) {}
  ngOnInit() {
  }

  onEmailSubmitted() {
    if (!this.email) {
      this.emailError = "L'adresse email est requise";
      return;
    }

    this.isLoading = true;
    this.emailError = '';

    this.userService.InitResetPassword(this.email).subscribe({
      next: () => {
        this.isLoading = false;
        this.msg = true;
      },
      error: (error) => {
        this.emailError = "Une erreur est survenue;vérifier votre mail";
        this.isLoading = false;
      }
    });
  }
}
