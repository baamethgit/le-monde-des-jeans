import { Component, inject, Input, OnInit } from '@angular/core';
import { CheckoutProgressBarComponent, CheckoutStep } from '../../checkout-progress-bar/checkout-progress-bar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ZoneLivraison } from '../../../models/zone-livraison';
import { UserService } from '../../../services/users/user.service';
import { CommandeService } from '../../../services/commande.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-detail-commande',
  standalone: true,
  imports: [CheckoutProgressBarComponent,FormsModule,CommonModule,ReactiveFormsModule,RouterLink],
  templateUrl: './detail-commande.component.html',
  styleUrl: './detail-commande.component.scss'
})
export class DetailCommandeComponent implements OnInit{
  methodePaiement = 'paiement_livraison';
  CheckoutStep : CheckoutStep = CheckoutStep.DetailsCommande;
  @Input() a_livrer : boolean = true;
  zones: ZoneLivraison[] = [];
  selectedZone: ZoneLivraison | undefined;
  commandeService = inject(CommandeService);
  onZoneChange() {
    // Logique pour mettre à jour le coût de livraison en fonction de la zone sélectionnée
    // Par exemple :
    // if (this.selectedZone === 'ZONE 1 : Ngor-Ouakam-almadies') {
    //   this.deliveryCost = 1000;
    // } else {
    //   // Ajustez le coût pour d'autres zones
    // }
  }

  constructor(){}
  ngOnInit(): void {
        this.commandeService.getDeliveryZones().subscribe({
          next:(data)=>{
            this.zones = data;
            this.selectedZone = this.zones[0];
          },
          error:(error)=>{

          }
        })
  }
}
