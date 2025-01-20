import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../services/users/user.service';
import { User } from '../../../models/user';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.scss'
})
export class AdminHeaderComponent implements OnInit{
  currentUser: User | undefined = undefined;
  is_authenticated = false;
  private userService = inject(UserService);

  constructor(){}

  ngOnInit(): void {
    this.userService.getUser().subscribe({
      next: (data) => {
          this.currentUser = data;
          this.is_authenticated = true;
      },
      error: (error) => {
        this.is_authenticated = false;
      }
    })
  }

  logout(): void {
    this.userService.logout().subscribe(
      (response) => {
        window.location.reload();

      }
    );
  }
}
