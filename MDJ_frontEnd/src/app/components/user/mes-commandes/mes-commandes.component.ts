import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { CommandeService } from '../../../services/commandes/commande.service';
import { Commande } from '../../../models/commande';
import { StatutCommande } from '../../../models/StatutCommande';

@Component({
  selector: 'app-mes-commandes',
  standalone: true,
  imports: [CommonModule,DatePipe],
  templateUrl: './mes-commandes.component.html',
  styleUrl: './mes-commandes.component.scss'
})
export class MesCommandesComponent implements OnInit {
  commandeService = inject(CommandeService);
  mesCommandesEnCours : Commande[] = [];
  mesCommandesLivrees : Commande[] = [];
  activeTab: 'pending' | 'completed' = 'pending';
  StatutCommande = StatutCommande;

  constructor() {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(){
    this.commandeService.getListeCommandesEnCours().subscribe({
      next : (data) => {
        this.mesCommandesEnCours = data;
      },
      error : (error) =>{
          
      },
    })
    this.commandeService.getListeCommandesHistorique().subscribe({
      next : (value) => {
          this.mesCommandesLivrees = value;
      },
      error : (err) =>{
          
      },
    })
  }


    // getStatusLabel(status: Order['status']): string {
  //   const statusMap = {
  //     en_cours: "En cours de livraison",
  //     preparation: "En préparation",
  //     livree: "Livrée"
  //   };
  //   return statusMap[status];
  // }

  // getStatusClass(status: Order['status']): string {
  //   const statusMap = {
  //     en_cours: "status-blue",
  //     preparation: "status-yellow",
  //     livree: "status-green"
  //   };
  //   return statusMap[status];
  // }
}