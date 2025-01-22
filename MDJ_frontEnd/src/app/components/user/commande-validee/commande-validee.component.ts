import { Component, inject, OnInit } from '@angular/core';
import { CheckoutProgressBarComponent, CheckoutStep } from '../../checkout-progress-bar/checkout-progress-bar.component';
import { RouterLink } from '@angular/router';
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
  commande! : Commande;
  private paiementService = inject(PaiementService);

  ngOnInit(): void {

  }

     verifierStatut(){
      // this.paiementService.:
    }

}
