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
    "commandes_par_statut": [] as any
  }
  ngOnInit() {
    this.getKpi();
  }


  currentDate = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

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


  formatAmount(amount: number): string {
    if (amount < 1000) {
      // Si le montant est inférieur à 1000, retourne-le tel quel
      return amount.toString();
    } else if (amount >= 1000 && amount < 1000000) {
      // Si le montant est compris entre 1000 et 1 million
      return (amount / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    } else if (amount >= 1000000 && amount < 1000000000) {
      // Si le montant est compris entre 1 million et 1 milliard
      return (amount / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    } else {
      // Si le montant est supérieur ou égal à 1 milliard
      return (amount / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
    }
  }

}
