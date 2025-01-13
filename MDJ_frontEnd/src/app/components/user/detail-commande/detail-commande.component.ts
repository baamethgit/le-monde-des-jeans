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
import { Paiement } from '../../../models/paiement';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaiementService } from '../../../services/paiement.service';


@Component({
  selector: 'app-detail-commande',
  standalone: true,
  imports: [CheckoutProgressBarComponent,FormsModule,CommonModule,ReactiveFormsModule,RouterLink],
  templateUrl: './detail-commande.component.html',
  styleUrl: './detail-commande.component.scss'
})
export class DetailCommandeComponent implements OnInit{
  methodePaiement : string = 'WAVE';
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
  paymentService = inject(PaiementService);
  userService = inject(UserService);
  isLoading = false;
  selectedOption: string = 'livraison';


  protected modalService = inject(NgbModal);

  constructor(private readonly router : Router){}

  ngOnInit(): void {
        this.commandeService.getDeliveryZones().subscribe({
          next:(data)=>{
            this.zones = data;
           
          },
          error:(error)=>{

          }
        })
        this.loadData();
  }

  openModal(modalname: any): void {
    this.modalService.open(modalname, { size: 'lg', centered: true });
  }

  payerCommande() : void{
    if(this.commande){
      let newData: { [key: string]: any } = {}; 

      newData['recupere_magasin'] = this.selectedOption === 'recuperation';
      if (this.selectedOption === 'livraison') { 
          newData['zone_livraison'] = this.selectedZone?.id;
      }
    
        this.commandeService.updateCommande(this.commande.id,newData).subscribe(
          {
            next(value) {
            },
            error(err) {
                
            },
          }
        )
       if(this.methodePaiement === 'WAVE'){
        this.payWithWave();
       }
      }
    }

    payWithWave() {
      if(this.commande?.id){
        this.paymentService.initiateWavePayment(this.commande.id).subscribe({
          next:(response: any) => {
            window.location.href = response.wave_launch_url;
          },
          error:(erreur: any) => {
            console.log("erreur")
          }
        }
          
        );
      }
    }

  loadData(){
    this.commandeService.getCurrentCommande().subscribe({
      next:(data)=>{
        this.commande = data;
        this.selectedOption = this.commande?.recupere_magasin ? 'recuperation' : 'livraison';
        this.selectedZone = this.commande?.recupere_magasin ? undefined : this.commande?.zone_livraison;
        if(!this.commande?.zone_livraison && this.zones.length){

          this.selectedZone = this.zones[0];
        }
      },
      error:(error)=>{
        this.message = '';
        this.router.navigate(['/panier']);
      }
    })
  }


  
  onZoneChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedZoneNumber = parseInt(selectElement.value, 10);

    this.loadZone(selectedZoneNumber);
    // @ts-ignore
    // this.commandeService.updateCommande(this.commande?.id,{'recupere_magasin':false,'zone_livraison':this.selectedZone?.id}).subscribe(
    //   {
    //     next(value) {
    //         console.log('update valide',value);
    //     },
    //     error(err) {
    //         console.log("erreur lors de la maj")
    //     },
    //   }
    // )
    // this.loadData();
  }

  loadZone(n:number){
    this.commandeService.getDeliveryZoneByNumber(n).subscribe({
      next:(data)=>{
        try{
          this.selectedZone = data;
        }catch{
          this.selectedZone = undefined;
        }
      },
      error:(error)=>{
        this.selectedZone = undefined;
        
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

//   annulerCommande(id:number){
//     this.commandeService.updateCommande(id,{statut:'ANNULEE'}).subscribe({
//       next:(data)=>{
//         this.router.navigate(['/mdj_admin/commandes/'])
//       },
//       error:(error)=>{

//       }
//     })
// }


}
