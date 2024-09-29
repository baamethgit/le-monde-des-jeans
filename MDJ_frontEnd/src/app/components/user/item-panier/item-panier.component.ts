import { Component, Input, OnInit } from '@angular/core';
import { Produit } from '../../../models/produit';
import { UserService } from '../../../services/users/user.service';
import { PanierProduit } from '../../../models/panier-produit';

@Component({
  selector: 'app-item-panier',
  standalone: true,
  imports: [],
  templateUrl: './item-panier.component.html',
  styleUrl: './item-panier.component.scss'
})
export class ItemPanierComponent implements OnInit {
  @Input() produit: Produit | undefined;
  @Input() panierProduit: PanierProduit | undefined;

  constructor(private userService: UserService){}

  removeProduit(id:number | undefined):void {
    this.userService.delProductFromCart(<number>id).subscribe({

    })
  }

  ngOnInit(): void {
    console.log('produit: ', this.produit);
  }

  getProductImageUrl(): string {
    if (this.produit?.images && this.produit.images.length > 0) {
      return this.produit.images[0].image;
    }
    return 'src/assets/img/285645_user_icon.png'; // Assurez-vous que cette image existe dans votre projet
  }
}
