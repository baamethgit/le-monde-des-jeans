import { Component, input } from '@angular/core';
import { Commande } from '../../../models/commande';


export enum StatutCommande {
  EN_ATTENTE_PAIEMENT = 'EN_ATTENTE_PAIEMENT',
  LIVREE = 'LIVREE',
}

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
  commande = input<Commande>;

  changeStatut(statut: StatutCommande){

  }
}
