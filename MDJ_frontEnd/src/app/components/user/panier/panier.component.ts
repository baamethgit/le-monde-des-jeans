import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckoutProgressBarComponent, CheckoutStep } from '../../checkout-progress-bar/checkout-progress-bar.component';
import { Panier } from '../../../models/panier';
import { ItemPanierComponent } from '../item-panier/item-panier.component';
import { RouterLink } from '@angular/router';
import { User } from '../../../models/user';
import { UserService } from '../../../services/users/user.service';
import { PanierService } from '../../../services/panier.service';
import { IcontenuPanier, Ipanier } from './panier.model';


@Component({
  selector: 'app-panier',
  standalone: true,
  imports: [FormsModule,CommonModule,CheckoutProgressBarComponent,RouterLink],
  templateUrl: './panier.component.html',
  styleUrl: './panier.component.scss'
})
export class PanierComponent implements OnInit {
  selectedOption: string = 'livraison';
  CheckoutStep : CheckoutStep = CheckoutStep.Panier;
  currentUser: User | undefined = undefined;
  contenupanier! : IcontenuPanier;

  private userService = inject(UserService);
  private panierService = inject(PanierService);

  panier:Omit<Ipanier,'produits'>|undefined;
  
  constructor(){}

  ngOnInit(): void {
    this.userService.getUser().subscribe({
      next: (data) => {
          this.currentUser = data;
          this.panierService.getPanier().subscribe({
            next:(data)=>{
              this.panier = data;
              console.log('panier: ',this.panier)
            }
          })
      },
      error: (error) => {
      }
    })
  }
  

  removeProd(){
    
  }
}
