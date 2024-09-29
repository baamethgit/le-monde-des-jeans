import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckoutProgressBarComponent, CheckoutStep } from '../../checkout-progress-bar/checkout-progress-bar.component';
import { Panier } from '../../../models/panier';
import { ItemPanierComponent } from '../item-panier/item-panier.component';
import { RouterLink } from '@angular/router';
import { User } from '../../../models/user';
import { UserService } from '../../../services/users/user.service';


@Component({
  selector: 'app-panier',
  standalone: true,
  imports: [FormsModule,CommonModule,CheckoutProgressBarComponent,ItemPanierComponent,RouterLink],
  templateUrl: './panier.component.html',
  styleUrl: './panier.component.scss'
})
export class PanierComponent implements OnInit {
  selectedOption: string = 'livraison';
  CheckoutStep : CheckoutStep = CheckoutStep.Panier;
  currentUser: User | undefined = undefined;
  is_authenticated = false;
  private userService = inject(UserService);
  panier:Panier|undefined;
  
  constructor(){}

  ngOnInit(): void {
    this.userService.getUser().subscribe({
      next: (data) => {
          this.currentUser = data;
          this.is_authenticated = true;
          this.userService.getUserCart(<string>this.currentUser.phone_number).subscribe({
            next:(data)=>{
              this.panier=data
              console.log('panier: ',this.panier)
            }
          })
      },
      error: (error) => {
        this.is_authenticated = false;
      }
    })
  }
  
  deleteProd(){

  }
}
