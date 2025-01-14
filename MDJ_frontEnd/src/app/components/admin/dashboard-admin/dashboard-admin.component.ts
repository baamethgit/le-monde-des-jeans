import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { KpiService } from '../../../services/kpi.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.scss'
})
export class DashboardAdminComponent implements OnInit {
  kpiService = inject(KpiService);
  erreur_kpi : boolean = false;
  isLoading : boolean = true;

  kpi = {
    "nombre_produits": 1,
    "nombre_produits_en_rupture_de_stock": 0,
    "nombre_clients": 1,
    "nombre_nouveau_clients": 1,
    "nombre_commandes": 0,
    "nombre_nouvelles_commandes": 0,
    "ventes_totales": 0,
    "ventes_par_methode": {},
    "commandes_par_statut": []
  }
  totalSales: number = 15789;
  pendingOrders: number = 23;
  newCustomers: number = 45;

  ngOnInit() {
    this.getKpi();
  }


  currentDate = new Date().toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  salesData = [
    { label: 'Lun', amount: 450000, percentage: 45 },
    { label: 'Mar', amount: 650000, percentage: 65 },
    { label: 'Mer', amount: 850000, percentage: 85 },
    { label: 'Jeu', amount: 550000, percentage: 55 },
    { label: 'Ven', amount: 750000, percentage: 75 },
    { label: 'Sam', amount: 950000, percentage: 95 },
    { label: 'Dim', amount: 350000, percentage: 35 }
  ];

  orderStatus = [
    { label: 'En attente', count: 45, percentage: 30, colorClass: 'bg-warning' },
    { label: 'Payée', count: 32, percentage: 20, colorClass: 'bg-success' },
    { label: 'EN_COURS_LIVRAISON', count: 28, percentage: 15, colorClass: 'bg-info' },
    { label: 'Livrée', count: 16, percentage: 8, colorClass: 'bg-secondary' }
  ];


  
  getKpi():void{
    this.kpiService.getDashboardKpi().pipe(
      finalize(()=>{
        this.isLoading = false;
      })
    ).subscribe({
      next:(response_data)=>{
        this.kpi = response_data;
      },
      error : (error) => {
        this.erreur_kpi = true;
      },
    })
  }
}