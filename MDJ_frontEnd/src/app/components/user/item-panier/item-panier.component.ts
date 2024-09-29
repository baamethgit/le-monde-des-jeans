import { Component, Input } from '@angular/core';
import { Produit } from '../../../models/produit';

@Component({
  selector: 'app-item-panier',
  standalone: true,
  imports: [],
  templateUrl: './item-panier.component.html',
  styleUrl: './item-panier.component.scss'
})
export class ItemPanierComponent {
  @Input() produit : Produit | undefined;
  removeproduit(){

  }
}
