import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckoutProgressBarComponent, CheckoutStep } from '../../checkout-progress-bar/checkout-progress-bar.component';

@Component({
  selector: 'app-panier',
  standalone: true,
  imports: [FormsModule,CommonModule,CheckoutProgressBarComponent],
  templateUrl: './panier.component.html',
  styleUrl: './panier.component.scss'
})
export class PanierComponent {
  selectedOption: string = 'livraison';
  CheckoutStep : CheckoutStep = CheckoutStep.DetailsCommande;;
}
