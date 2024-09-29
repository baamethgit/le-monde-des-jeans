import { Component } from '@angular/core';
import { CheckoutProgressBarComponent, CheckoutStep } from '../../checkout-progress-bar/checkout-progress-bar.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-commande-validee',
  standalone: true,
  imports: [CheckoutProgressBarComponent,RouterLink],
  templateUrl: './commande-validee.component.html',
  styleUrl: './commande-validee.component.scss'
})
export class CommandeValideeComponent {
  CheckoutStep : CheckoutStep = CheckoutStep.FinaliserCommande;
}
