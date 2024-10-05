import { Component, inject, Input, OnInit } from '@angular/core';
import { CheckoutProgressBarComponent, CheckoutStep } from '../../checkout-progress-bar/checkout-progress-bar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ZoneLivraison } from '../../../models/zone-livraison';
import { UserService } from '../../../services/users/user.service';
import { CommandeService } from '../../../services/commandes/commande.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../../models/user';
import { Commande } from '../../../models/commande';
import { PaymentMethod } from '../../../models/PaymentMethod';
import { Paiement } from '../../../models/paiement';


@Component({
  selector: 'app-detail-commande',
  standalone: true,
  imports: [CheckoutProgressBarComponent,FormsModule,CommonModule,ReactiveFormsModule,RouterLink],
  templateUrl: './detail-commande.component.html',
  styleUrl: './detail-commande.component.scss'
})
export class DetailCommandeComponent implements OnInit{
  methodePaiement = 'PAIEMENT_LIVRAISON';
  CheckoutStep : CheckoutStep = CheckoutStep.DetailsCommande;
  @Input() a_livrer : boolean = true;
  commande : Commande | undefined;
  zones: ZoneLivraison[] = [];
  selectedZone: ZoneLivraison | undefined;
  prixLivraison : number = 0;
  message : string = '';
  numZone = 1;
  client! : User;
  commandeService = inject(CommandeService);
  userService = inject(UserService);
  modelOpen = false;
  isLoading = false;
  paiement! : Paiement;

  constructor(private router : Router){}

  ngOnInit(): void {
        this.commandeService.getDeliveryZones().subscribe({
          next:(data)=>{
            this.zones = data;
            this.selectedZone = this.zones[1];
          },
          error:(error)=>{

          }
        })
        this.loadData();
  }

  payerCommande(id_commande:number){
      this.openPaymentOverlay(this.methodePaiement);
  }

  openPaymentOverlay(operateur : string){
    this.modelOpen = true;
  }

  validerCommande(operateur : string){

  }

  loadData(){
    this.commandeService.getCurrentCommande().subscribe({
      next:(data)=>{
        this.commande = data;
      },
      error:(error)=>{
        this.message = ''
      }
    })
  }

  marquerCommePayee(){
    
  }

  get totalCommande(){
    return this.prixLivraison + 0;
  }
  
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

  supprimerCommande(id:number){
      this.commandeService.supprimerCommande(id).subscribe({
        next:(data)=>{
          // this.alertMessage = 'Votre commande est supprimé'
          this.router.navigate(['/'])
        },
        error:(error)=>{
  
        }
      })
  }

  annulerCommande(id:number){
    this.commandeService.updateCommande(id,{statut:'ANNULEE'}).subscribe({
      next:(data)=>{
        this.router.navigate(['/mdj_admin/commandes/'])
      },
      error:(error)=>{

      }
    })
}
}
