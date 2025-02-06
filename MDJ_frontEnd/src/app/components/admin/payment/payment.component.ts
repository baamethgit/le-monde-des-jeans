import { CommonModule, DatePipe } from '@angular/common';
import {Component, inject, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {PaiementService} from "../../../services/paiement.service";
import {finalize} from "rxjs";

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule,FormsModule,DatePipe],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent implements OnInit{

  selectedMethod = '';
  startDate = '';
  endDate = '';
  minAmount = 0;
  payments : any = [];
  isPLoading : boolean = false;
  isKpiLoading : boolean = false;
  paiementService = inject(PaiementService);

  kpi = {
    "total_paiement": 0,
    "paiement_par_wave": 0,
    "paiement_par_om": 0,
    "paiement_par_cb": 0
  } as any

  ngOnInit() {
    this.loadPayment();
    this.loadPaymentKPI();
  }

  loadPayment():void{
    this.isPLoading = true;

    const filters = {
      selectedMethod: this.selectedMethod,
      startDate: this.startDate,
      endDate: this.endDate,
      minAmount: this.minAmount
    };

    this.paiementService.getPayments(filters).pipe(
      finalize(()=>{
        this.isPLoading = false;
      })
    ).subscribe(
      {
        next:(data)=>{
          this.payments = data;
        }
      }
    )
  }

  loadPaymentKPI():void{
    this.isKpiLoading = true;
    const filters = {
      selectedMethod: this.selectedMethod,
      startDate: this.startDate,
      endDate: this.endDate,
      minAmount: this.minAmount
    };
    this.paiementService.getPaymentSummary(filters).pipe(
      finalize(()=>{
        this.isKpiLoading = false;
      })
    ).subscribe(
      {
        next:(data)=>{
          this.kpi = data;
        },
        error:(error)=>{

        }
      }
    )
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
