import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/user';
import { UserService } from '../../../services/users/user.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.scss'
})
export class ProfilComponent implements OnInit{
  user : User | undefined;
  nb_commandes_livrees : number = 0;
  nb_commandes_attente : number = 0;
  nb_commandes_total : number = 0;

  constructor (private UserService:UserService){}

  ngOnInit(): void {
    this.UserService.getUser().subscribe({
      next: (data) => {
      this.user = data;
      },
      error: (error) => {
        console.log(error);
      }
    })
}
}
