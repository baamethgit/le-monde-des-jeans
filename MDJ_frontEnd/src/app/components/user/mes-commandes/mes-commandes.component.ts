import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { CommandeService } from '../../../services/commandes/commande.service';
import { Commande } from '../../../models/commande';
import { StatutCommande } from '../../../models/StatutCommande';



interface Order {
  id: string;
  date: string;
  status: 'en_cours' | 'preparation' | 'livree';
  items: string[];
  total: number;
  deliveryAddress: string;
  estimatedDelivery?: string;
  deliveryTime?: string;
}

@Component({
  selector: 'app-mes-commandes',
  standalone: true,
  imports: [CommonModule,DatePipe],
  templateUrl: './mes-commandes.component.html',
  styleUrl: './mes-commandes.component.scss'
})
export class MesCommandesComponent implements OnInit {
  commandeService = inject(CommandeService);
  mesCommandes : Commande[] = [];
  mesCommandesLivrees : Commande[] = [];
  activeTab: 'pending' | 'completed' = 'pending';
  StatutCommande = StatutCommande;
  
  pendingOrders: Order[] = [
    {
      id: "CMD-2024-001",
      date: "05/10/2024",
      status: "en_cours",
      items: ["Pizza Margherita", "Coca Cola"],
      total: 12500,
      deliveryAddress: "Ngor-Ouakam-almadies",
      estimatedDelivery: "15:30"
    },
    {
      id: "CMD-2024-002",
      date: "05/10/2024",
      status: "preparation",
      items: ["Burger Deluxe", "Frites", "Fanta"],
      total: 8500,
      deliveryAddress: "Ngor-Ouakam-almadies",
      estimatedDelivery: "16:00"
    }
  ];

  completedOrders: Order[] = [
    {
      id: "CMD-2024-000",
      date: "04/10/2024",
      status: "livree",
      items: ["Salade César", "Jus d'orange"],
      total: 9000,
      deliveryAddress: "Ngor-Ouakam-almadies",
      deliveryTime: "14:45"
    }
  ];



  getStatusLabel(status: Order['status']): string {
    const statusMap = {
      en_cours: "En cours de livraison",
      preparation: "En préparation",
      livree: "Livrée"
    };
    return statusMap[status];
  }

  getStatusClass(status: Order['status']): string {
    const statusMap = {
      en_cours: "status-blue",
      preparation: "status-yellow",
      livree: "status-green"
    };
    return statusMap[status];
  }

  constructor() {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(){
    this.commandeService.getListeCommandes().subscribe({
      next : (data) => {
        this.mesCommandes = data;
      },
      error : (error) =>{
          
      },
    })
    this.commandeService.getListeCommandesByStatut(StatutCommande.PAYEE).subscribe({
      next : (value) => {
          this.mesCommandesLivrees = value;
      },
      error : (err) =>{
          
      },
    })
  }
}