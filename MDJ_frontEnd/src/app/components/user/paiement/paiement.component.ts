import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-paiement',
  standalone: true,
  imports: [],
  templateUrl: './paiement.component.html',
  styleUrl: './paiement.component.scss'
})
export class PaiementComponent {
  @Input() PaymentMethod! : string;
}
