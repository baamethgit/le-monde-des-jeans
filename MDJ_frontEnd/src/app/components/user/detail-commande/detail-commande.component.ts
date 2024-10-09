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


@Component({
  selector: 'app-detail-commande',
  standalone: true,
  imports: [CheckoutProgressBarComponent,FormsModule,CommonModule,ReactiveFormsModule,RouterLink],
  templateUrl: './detail-commande.component.html',
  styleUrl: './detail-commande.component.scss'
})
export class DetailCommandeComponent implements OnInit{
  methodePaiement = 'WAVE';
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
  isLoading = false;
  paiement! : Paiement;
  selectedOption: string = 'livraison';

  protected modalService = inject(NgbModal);

  constructor(private readonly router : Router){}

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

  openModal(modalname: any): void {
    this.modalService.open(modalname, { size: 'lg', centered: true });
  }

  payerCommande(id_commande:number) : void{
      let newData: { [key: string]: any } = {}; 

      newData['recupere_magasin'] = this.selectedOption === 'recuperation';
      if (this.selectedOption === 'livraison') { 
          newData['zone_livraison'] = this.selectedZone;
      }
    
        this.commandeService.updateCommande(id_commande,newData).subscribe(
          {
            next(value) {
                console.log('update valide',value);
            },
            error(err) {
                console.log("erreur lors de la maj")
            },
          }
        )
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
