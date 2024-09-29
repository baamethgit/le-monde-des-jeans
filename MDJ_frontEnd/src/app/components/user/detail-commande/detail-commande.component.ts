import { Component, inject, Input, OnInit } from '@angular/core';
import { CheckoutProgressBarComponent, CheckoutStep } from '../../checkout-progress-bar/checkout-progress-bar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ZoneLivraison } from '../../../models/zone-livraison';
import { UserService } from '../../../services/users/user.service';
import { CommandeService } from '../../../services/commande.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { User } from '../../../models/user';


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
  prixLivraison : number = 0;
  numZone = 1;
  client! : User;
  commandeService = inject(CommandeService);
  userService = inject(UserService);

  onZoneChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedZoneNumber = parseInt(selectElement.value, 10);
    this.loadZone(selectedZoneNumber);
  }

  loadZone(n:number){
    this.commandeService.getDeliveryZoneByNumber(n).subscribe({
      next:(data)=>{
        this.selectedZone = data;
      },
      error:(error)=>{

      }
    })
  }

  constructor(){}
  ngOnInit(): void {
        this.userService.getUser().subscribe({
          next: (data) => {
              this.client = data;
          },
          error: (error) => {
          }
        })
        this.commandeService.getDeliveryZones().subscribe({
          next:(data)=>{
            this.zones = data;
            console.log(this.zones)
            this.selectedZone = this.zones[1];
          },
          error:(error)=>{

          }
        })

  }
}
