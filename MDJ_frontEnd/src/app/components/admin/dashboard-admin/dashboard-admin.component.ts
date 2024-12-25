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
    { label: 'En préparation', count: 28, percentage: 15, colorClass: 'bg-info' },
    { label: 'En livraison', count: 24, percentage: 12, colorClass: 'bg-primary' },
    { label: 'Livrée', count: 16, percentage: 8, colorClass: 'bg-secondary' }
  ];

  topProducts = [
    { name: 'T-Shirt Premium', price: 15000, stockStatus: 'En stock', emoji: '👕', salesPercentage: 85 },
    { name: 'Sneakers Air', price: 45000, stockStatus: 'En stock', emoji: '👟', salesPercentage: 75 },
    { name: 'Jeans Classic', price: 25000, stockStatus: 'Rupture', emoji: '👖', salesPercentage: 45 },
    { name: 'Casquette Sport', price: 12000, stockStatus: 'En stock', emoji: '🧢', salesPercentage: 60 }
  ];
}