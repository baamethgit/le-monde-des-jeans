import {Component, Inject, inject, Input, OnInit, PLATFORM_ID} from '@angular/core';
import { CheckoutProgressBarComponent, CheckoutStep } from '../../checkout-progress-bar/checkout-progress-bar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ZoneLivraison } from '../../../models/zone-livraison';
import { UserService } from '../../../services/users/user.service';
import { CommandeService } from '../../../services/commandes/commande.service';
import {CommonModule, isPlatformBrowser} from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../../models/user';
import { Commande } from '../../../models/commande';
import { PaiementService } from '../../../services/paiement.service';
import {finalize} from "rxjs";
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader";
import {environment} from "../../../../environments/environment";
import {InfosService} from "../../../services/infos.service";
import {Infos} from "../../../models/infos.module";
import {ImageViewerComponent} from "../../image-viewer/image-viewer.component";


@Component({
  selector: 'app-detail-commande',
  standalone: true,
  imports: [CheckoutProgressBarComponent,FormsModule,CommonModule,ReactiveFormsModule,NgxSkeletonLoaderModule],
  templateUrl: './detail-commande.component.html',
  styleUrl: './detail-commande.component.scss'
})
export class DetailCommandeComponent implements OnInit{
  methodePaiement : 'ORANGE_MONEY' | 'WAVE' = 'WAVE' ;
  CheckoutStep : CheckoutStep = CheckoutStep.DetailsCommande;
  commande : Commande | undefined;
  zones: ZoneLivraison[] = [];
  selectedZone: ZoneLivraison | undefined;
  message : string = '';
  client! : User;
  commandeService = inject(CommandeService);
  paymentService = inject(PaiementService);
  userService = inject(UserService);
  private readonly infosService = inject(InfosService);
  infos:Infos | undefined;


  isLoading = false;
  isZoneLoading = false;
  selectedOption: string = 'livraison';
  numAdmin : string = environment.numAdmin;
  private isBrowser: boolean;



  constructor(private readonly router : Router,
              @Inject(PLATFORM_ID) platformId: Object
  ){
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
        this.commandeService.getDeliveryZones().subscribe({
          next:(data)=>{
            this.zones = data;
          },
          error:(error)=>{
          }
        })
        this.loadData();
        this.getAdminNumber();
  }

  getAdminNumber():void{
    this.infosService.getInfos().subscribe(
      {
        next: (data) => {
          this.infos = data;
        }
      }
    )
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
       }else if(this.methodePaiement === 'ORANGE_MONEY'){
         this.payWithOM();
       }

    }else {
     alert("une erreur est survenue.Impossible de payer");
      if(this.isBrowser){
        window.location.reload();
      }
    }
  }

  updateCommandeZone(zoneId: number | undefined) {
    this.isZoneLoading = true;
    if (this.commande?.id) {
      const updateData = {
        recupere_magasin: this.selectedOption === 'recuperation',
        zone_livraison: zoneId
      };

      this.commandeService.updateCommande(this.commande.id, updateData).pipe(
        finalize(()=>{
          this.isZoneLoading = false;
        })
      ).subscribe({
        next: () => this.loadData(),
        error: (err) => console.error('Erreur mise à jour zone:', err)
      });
    }
  }

    payWithWave() {
      if(this.commande?.id){
        this.paymentService.initiateWavePayment(this.commande.id).subscribe({
          next:(response: any) => {
            window.location.href = response.wave_launch_url;
          },
          error:(erreur: any) => {
            alert("Erreur lors de la tentative de paiement.Veuillez réessayer");
            if(this.isBrowser){
              window.location.reload();
            }
          }
        }

        );
      }
    }

  payWithOM() {
    if(this.commande?.id){

      this.paymentService.repousserExpiration(this.commande.id).subscribe({
          next:(response: any) => {
            this.router.navigate(["payer/orange_money"], {
              state: { vientDeRedirection: true }
            });
          },
          error:(erreur: any) => {
            alert("Erreur lors de la tentative de paiement.Veuillez réessayer");
            if(this.isBrowser){
              window.location.reload();
            }
          }
        }
      );
    }
  }


  loadData(){
    this.isLoading = true;
    this.commandeService.getCurrentCommande().pipe(
      finalize(
        ()=>{
          this.isLoading = false;
        }
      )
    ).subscribe({
      next:(data)=>{
        this.commande = data;
        //this.selectedOption = this.commande?.recupere_magasin ? 'recuperation' : 'livraison';
        //if (this.selectedOption === 'livraison'){
          if (this.commande?.zone_livraison) {
            this.selectedOption = "livraison";
            this.selectedZone = this.commande.zone_livraison;
          } else {
            this.selectedOption = "recuperation";
            if (this.zones.length) {
              this.selectedZone = this.zones[0];
            }
          }
        //}

      },
      error:(error)=>{
        this.message = '';
        this.router.navigate(['/panier']);
      }
    })
  }



  onZoneChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedZoneId = parseInt(selectElement.value, 10);
    this.loadZone(selectedZoneId);
    this.updateCommandeZone(selectedZoneId);
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
      this.commandeService.supprimerMaCommande(id).subscribe({
        next:(data)=>{
          this.router.navigate(['/produits'])
        },
        error:(error)=>{

        }
      })
  }

  get calculTotal(): number {
    if (!this.commande) return 0;

    // Convertir explicitement en nombres
    const montantProduits = this.commande.produits.reduce((total, produit) =>
      total + (Number(produit.prix) || 0), 0);

    const fraisLivraison = (this.selectedOption === 'livraison' && this.selectedZone)
      ? Number(this.selectedZone.prix_livraison || 0)
      : 0;

    // Utiliser Number() pour s'assurer que c'est bien un calcul numérique
    const total = Number(montantProduits) + Number(fraisLivraison);

    // Arrondir à 2 décimales pour éviter les erreurs de précision
    return Math.round(total * 100) / 100;
  }

}
