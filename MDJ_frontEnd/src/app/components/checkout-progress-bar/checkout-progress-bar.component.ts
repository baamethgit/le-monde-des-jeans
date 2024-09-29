import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

export enum CheckoutStep {
  Panier = 1,
  DetailsCommande = 2,
  FinaliserCommande = 3
}

@Component({
  selector: 'app-checkout-progress-bar',
  standalone: true,
  imports: [NgClass],
  templateUrl: './checkout-progress-bar.component.html',
  styleUrl: './checkout-progress-bar.component.scss'
})
export class CheckoutProgressBarComponent {
 
  @Input() currentStep: CheckoutStep = CheckoutStep.Panier;
  CheckoutStep = CheckoutStep;

  getStepStatus(step: CheckoutStep): 'actif' | 'complet' | 'attente' {
    if (step < this.currentStep) return 'complet';
    if (step === this.currentStep) return 'actif';
    return 'attente';
  }

}
