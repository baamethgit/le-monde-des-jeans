import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.scss'
})
export class DashboardAdminComponent implements OnInit {
  totalSales: number = 15789;
  pendingOrders: number = 23;
  newCustomers: number = 45;

  salesChartData: any[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Ventes' }
  ];
  salesChartLabels: string[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  chartOptions: any = {
    responsive: true,
  };

  recentOrders = [
    { id: 1, client: 'Jean Dupont', amount: 120.50, status: 'En attente' },
    { id: 2, client: 'Marie Martin', amount: 85.75, status: 'Expédiée' },
    { id: 3, client: 'Pierre Durand', amount: 200.00, status: 'Livrée' },
  ];

  ngOnInit() {
    // Ici, vous pouvez ajouter la logique pour charger les données réelles
    // par exemple, en appelant un service qui communique avec votre backend
  }
}