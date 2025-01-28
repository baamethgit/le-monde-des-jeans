import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {UserService} from "../../../services/users/user.service";
import {finalize} from "rxjs";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss'
})
export class VerifyEmailComponent implements OnInit{
  message: string = '';
  error: string = '';
  isLoading: boolean = true;
  private userService = inject(UserService);

  constructor(private route: ActivatedRoute,private router : Router) {}

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.verifyEmail(token);
    } else {
      this.error = 'Token manquant.';
      this.isLoading = false;
    }
  }

  verifyEmail(token: string) {
    this.userService.verifyEmail(token)
      .pipe(
        finalize (() => {
          this.isLoading = false;
        })
      )
      .subscribe({
      next: (response: any) => {
        this.message = response.message;
        this.error = "";
        alert('votre compte est activé.Veuillez vous connecter');
        this.router.navigate(['/login']);
      },
      error: (error:any) => {
        this.message = "";
        this.error = error.error.error || 'Une erreur s\'est produite.';
      }
    })
  }
}
