import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckoutProgressBarComponent, CheckoutStep } from '../../checkout-progress-bar/checkout-progress-bar.component';

import { Router, RouterLink } from '@angular/router';
import { PanierService } from '../../../services/panier.service';
import { IcontenuPanier, Ipanier } from './panier.model';
import {finalize, interval, Subscription} from 'rxjs';

import { CommandeService } from '../../../services/commandes/commande.service';



@Component({
  selector: 'app-panier',
  standalone: true,
  imports: [FormsModule,CommonModule,CheckoutProgressBarComponent,RouterLink],
  templateUrl: './panier.component.html',
  styleUrl: './panier.component.scss'
})
export class PanierComponent implements OnInit ,OnDestroy{
  CheckoutStep : CheckoutStep = CheckoutStep.Panier;
  isLoading = false;

  panier:Omit<Ipanier,'produits'>|undefined;
  contenupanier : IcontenuPanier[] = [];
  errorMessage : string = '';
  private readonly panierService = inject(PanierService);
  private readonly commandeService = inject(CommandeService);

  tempsRestant: { [key: number]: { minutes: number, seconds: number } } = {};
  private timerSubscription! : Subscription;


  constructor(private readonly router : Router){}

  ngOnInit() {
    this.loadData();
    // this.demarrerTimer();
    this.timerSubscription = interval(1000).subscribe(() => {
      // Force le rendu du template pour mettre à jour les compteurs
      this.contenupanier = [...this.contenupanier];
    });
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  commander(){
    this.commandeService.creerCommande(true).subscribe({
      next:(data)=>{
        this.router.navigate(['/detail-commande']);
      },
      error : (error)=>{
        if(error.error.message_erreur)
          this.errorMessage = "Vous avez une commande en attente,veuillez la valider d'abord .";
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


  loadData():void{
    this.isLoading = true;
    this.panierService.getPanier().pipe(
      finalize(()=>{
        this.isLoading = false;
      })
    ).subscribe({
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

  getTempsRestant(produitSlug:string,dateAjout: string): string {
    const dateAjoutMs = new Date(dateAjout).getTime();
    const maintenant = new Date().getTime();
    const tempsEcoule = maintenant - dateAjoutMs;
    const tempsRestantMs = (5 * 60 * 1000) - tempsEcoule; // 5 minutes en millisecondes

    if (tempsRestantMs <= 0) {
      this.removeProd(produitSlug);
      return 'Expiré';
    }

    // Convertir en minutes et secondes
    const minutes = Math.floor(tempsRestantMs / (60 * 1000));
    const secondes = Math.floor((tempsRestantMs % (60 * 1000)) / 1000);

    return `Expire dans ${minutes}min ${secondes}s`;
  }

  getTimeColor(dateAjout: string): string {
    const dateAjoutMs = new Date(dateAjout).getTime();
    const maintenant = new Date().getTime();
    const tempsEcoule = maintenant - dateAjoutMs;
    const tempsRestantMs = (5 * 60 * 1000) - tempsEcoule;

    if (tempsRestantMs <= 60000) { // Dernière minute
      return 'red';
    } else if (tempsRestantMs <= 120000) { // 2 dernières minutes
      return 'orange';
    }
    return 'green';
  }

}
