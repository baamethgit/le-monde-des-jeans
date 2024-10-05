import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckoutProgressBarComponent, CheckoutStep } from '../../checkout-progress-bar/checkout-progress-bar.component';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../../models/user';
import { UserService } from '../../../services/users/user.service';
import { PanierService } from '../../../services/panier.service';
import { IcontenuPanier, Ipanier } from './panier.model';
import { interval, startWith, Subscription, switchMap } from 'rxjs';
import { CommandeService } from '../../../services/commandes/commande.service';


@Component({
  selector: 'app-panier',
  standalone: true,
  imports: [FormsModule,CommonModule,CheckoutProgressBarComponent,RouterLink],
  templateUrl: './panier.component.html',
  styleUrl: './panier.component.scss'
})
export class PanierComponent implements OnInit ,OnDestroy{
  selectedOption: string = 'livraison';
  CheckoutStep : CheckoutStep = CheckoutStep.Panier;
  currentUser: User | undefined = undefined;
  contenupanier : IcontenuPanier[] = [];
  errorMessage : string = '';
  private panierService = inject(PanierService);
  private commandeService = inject(CommandeService);

  panier:Omit<Ipanier,'produits'>|undefined;
  tempsRestant: { [key: number]: { minutes: number, seconds: number } } = {};
  private timerSubscription! : Subscription;

  constructor(private router : Router){}

  ngOnInit() {
    this.loadData();
    // this.demarrerTimer();
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
  
  commander(){
    this.commandeService.creerCommande(true).subscribe({
      next:(data)=>{
        this.router.navigate(['/panier-valider']);
      },
      error : (error)=>{
        if(error.error.message_erreur)
          this.errorMessage = error.error.message_erreur;
      },
    })
  }

  removeProd(produitSlug:string){
    this.panierService.retirerProduit(produitSlug).subscribe({
      next: (data) => {
        alert('produit supprimé avec succés');
        this.loadData();
    },
    error: (error) => {
    }
    })    
  }

  viderPanier(){
    this.panierService.viderPanier().subscribe({
      next: (data) => {
          this.loadData();
          // this.message = 'Votre Panier est vidé !'
      },
      error: (error) => {
        
      }
    });
  }

  loadData(){
    this.panierService.getPanier().subscribe({
      next: (data) => {
          this.panier = data;
      },
      error: (error) => {
      }
    });
    this.panierService.getContenuPanier().subscribe({
      next: (data) => {
        this.contenupanier = data;
    },
    error: (error) => {
    }
    })
    this.mettreAJourTempsRestant();
  }

  mettreAJourTempsRestant() {
    if (this.panier && this.contenupanier) {
      this.contenupanier.forEach((content: any) => {
        this.tempsRestant[content.produit.id] = this.panierService.calculerTempsRestant(content.produit.date_ajout);
      });
    }
  }

  demarrerTimer() {
    // this.timerSubscription = interval(1000).pipe(
    //   startWith(0),
    //   switchMap(() => this.panierService.getPanier())
    // ).subscribe({
    //   next:(data)=>{
    //     // this.panier = data;
    //     // this.mettreAJourTempsRestant();
    //     // this.verifierExpirations();
    //   },
    //   error:(error)=>{
    //     console.error('Erreur lors de la mise à jour du panier', error)
    //   }
    // }
    // );
  }

  verifierExpirations() {
    let produitExpire = false;
    Object.keys(this.tempsRestant).forEach(id => {
      if (this.tempsRestant[Number(id)].minutes === 0 && this.tempsRestant[Number(id)].seconds === 0) {
        produitExpire = true;
      }
    });

    if (produitExpire) {
      this.loadData();
    }
  }

}
