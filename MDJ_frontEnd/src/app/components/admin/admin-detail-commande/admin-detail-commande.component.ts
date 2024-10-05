import { Component, inject } from '@angular/core';
import { Commande } from '../../../models/commande';
import { CommandeService } from '../../../services/commandes/commande.service';
import { StatutCommande } from '../../../models/StatutCommande';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-detail-commande',
  standalone: true,
  imports: [],
  templateUrl: './admin-detail-commande.component.html',
  styleUrl: './admin-detail-commande.component.scss'
})
export class AdminDetailCommandeComponent {
  textStatut : string = '';
  statutCommande!: StatutCommande;
  commande! : Commande;
  commandeService = inject(CommandeService);
  protected readonly StatutCommande = StatutCommande;


  constructor(private router:Router){}

  changeStatut(statut: StatutCommande){
      this.commandeService.updateCommande(this.commande.id,{'statut':statut.toString()}).subscribe({
        next:(data)=>{
        
        },
        error:(error)=>{
  
        }
      })
  }

  supprimerCommande(){
    this.commandeService.supprimerCommande(this.commande.id).subscribe({
      next:(data)=>{
        this.router.navigate(['/mdj_admin/commandes/'])
      },
      error:(error)=>{

      }
    })
}
}
