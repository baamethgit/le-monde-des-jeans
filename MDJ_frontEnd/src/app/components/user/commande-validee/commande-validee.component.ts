import { Component, inject, OnInit } from '@angular/core';
import { CheckoutProgressBarComponent, CheckoutStep } from '../../checkout-progress-bar/checkout-progress-bar.component';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { PaiementService } from '../../../services/paiement.service';
import {Commande} from "../../../models/commande";
import {CommonModule, NgIf} from "@angular/common";

@Component({
  selector: 'app-commande-validee',
  standalone: true,
  imports: [CheckoutProgressBarComponent, RouterLink, CommonModule],
  templateUrl: './commande-validee.component.html',
  styleUrl: './commande-validee.component.scss'
})
export class CommandeValideeComponent implements OnInit{
  CheckoutStep : CheckoutStep = CheckoutStep.FinaliserCommande;
  private readonly paiementService = inject(PaiementService);

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  commande : Commande | undefined;

  ngOnInit(): void {
    const refCode = this.route.snapshot.params['ref-code'];
    if(!refCode){
      this.router.navigate(['**']);
    }else {
      this.paiementService.verifyPaymentStatus(refCode).subscribe({
        next: (data) => {
            this.commande = data['commande'];
            if(data['status']!='succeeded'){
              //
            }else {
              this.router.navigate(['payment-error',refCode]);
            }
        },
        error:(error)=>{
          this.router.navigate(['payment-error',refCode]);
        }})
    }
  }

}
