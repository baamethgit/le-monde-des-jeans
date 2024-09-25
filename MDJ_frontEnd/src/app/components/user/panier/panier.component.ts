import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckoutProgressBarComponent, CheckoutStep } from '../../checkout-progress-bar/checkout-progress-bar.component';
import { Panier } from '../../../models/panier';
import { ItemPanierComponent } from '../item-panier/item-panier.component';

@Component({
  selector: 'app-panier',
  standalone: true,
  imports: [FormsModule,CommonModule,CheckoutProgressBarComponent,ItemPanierComponent],
  templateUrl: './panier.component.html',
  styleUrl: './panier.component.scss'
})
export class PanierComponent {
  selectedOption: string = 'livraison';
  CheckoutStep : CheckoutStep = CheckoutStep.DetailsCommande;
  panier : Panier = {
    produits : [
      {
        ref: "PROD001",
        images: ["../../assets/img/434184115_122138643842191964_5638486375775067626_n.jpg", "../../assets/img/434184115_122138643842191964_5638486375775067626_n.jpg"],
        prix: 39.99,
        taille: "M",
        compo: "Coton",
        categorie: "Chemises"
      },
      {
        ref: "PROD002",
        nom: "Jean slim",
        images: ["../../assets/img/434184115_122138643842191964_5638486375775067626_n.jpg"],
        prix: 59.99,
        taille: "32",
        compo: "Coton",
        categorie: "Pantalons"
      },
      {
        ref: "PROD003",
        nom: "Robe d'été",
        images: ["../../assets/img/434184115_122138643842191964_5638486375775067626_n.jpg", "../../assets/img/434184115_122138643842191964_5638486375775067626_n.jpg", "../../assets/img/434184115_122138643842191964_5638486375775067626_n.jpg"],
        prix: 45.50,
        taille: "S",
        compo: "Viscose",
        categorie: "Lacoste"
      },
      {
        ref: "PROD004",
        images: ["../../assets/img/434184115_122138643842191964_5638486375775067626_n.jpg"],
        prix: 89.99,
        taille: "42",
        compo: "Synthétique",
        categorie: "Chaussures"
      },
      {
        ref: "PROD005",
        nom: "T-shirt basique",
        images: ["../../assets/img/434184115_122138643842191964_5638486375775067626_n.jpg", "../../assets/img/434184115_122138643842191964_5638486375775067626_n.jpg"],
        prix: 15.99,
        taille: "L",
        compo: "Coton",
        categorie: "Tee-shirt"
      }
    ]    
  };
}
