import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule,FormsModule,DatePipe,RouterLink],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent implements OnInit{

  selectedMethod = '';
  startDate = '';
  endDate = '';
  minAmount = 0;

  // Example data
  payments = [
    {
      id_transaction: 'TRX123456',
      commande_ref: 'CMD789',
      client: 'John Doe',
      montant: 150000,
      methode_paiement: 'ORANGE_MONEY',
      date_paiement: new Date(),
    },
    {
      id_transaction: 'TRX123457',
      commande_ref: 'CMD790',
      client: 'Jane Smith',
      montant: 75000,
      methode_paiement: 'WAVE',
      date_paiement: new Date(),
    },
    // Ajoutez plus de données d'exemple ici
  ];

  get filteredPayments() {
    return this.payments.filter(payment => {
      if (this.selectedMethod && payment.methode_paiement !== this.selectedMethod) {
        return false;
      }
      if (this.minAmount && payment.montant < this.minAmount) {
        return false;
      }
      // Ajoutez d'autres filtres si nécessaire
      return true;
    });
  }

  getMethodeBadgeClass(methode: string): string {
    const classes = {
      'ORANGE_MONEY': 'badge bg-om',
      'WAVE': 'badge bg-info',
      'CC': 'badge bg-success'
    };
    return classes[methode as keyof typeof classes] || 'badge bg-secondary';
  }

  getMethodeLabel(methode: string): string {
    const labels = {
      'ORANGE_MONEY': 'Orange Money',
      'WAVE': 'Wave',
      'CC': 'Carte de crédit'
    };
    return labels[methode as keyof typeof labels] || methode;
  }

  ngOnInit() {
    // Charger les données initiales
  }
}