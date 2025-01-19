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
}
