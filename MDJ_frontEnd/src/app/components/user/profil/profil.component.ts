import { Component, inject, OnInit } from '@angular/core';
import { User } from '../../../models/user';
import { UserService } from '../../../services/users/user.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CommandeService } from '../../../services/commandes/commande.service';
import {finalize} from "rxjs";
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader";

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [RouterLink, CommonModule, NgxSkeletonLoaderModule],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.scss'
})
export class ProfilComponent implements OnInit{
  user : User | undefined;
  nb_commandes_livrees : number = 0;
  nb_commandes_attente : number = 0;
  nb_commandes_total : number = 0;
  error : boolean = false;
  profilDataLoading = true;

  private commandeService = inject(CommandeService);

  constructor (private UserService:UserService){}

  ngOnInit(): void {
    this.profilDataLoading = true;
    this.UserService.getUser().pipe(
      finalize(() => this.profilDataLoading = false)
    ).subscribe({
      next: (data) => {
      this.user = data;
      },
      error: (error) => {
        this.error = true;
      }
    })
    this.commandeService.getStatsCommande().subscribe({
      next: (response) => {
          this.nb_commandes_total = response.total_commandes;
          this.nb_commandes_attente = response.commande_cours_livraison;
          this.nb_commandes_livrees = response.commandes_livrees;
      },
      error: (error) => {
      }
    });
}
}
