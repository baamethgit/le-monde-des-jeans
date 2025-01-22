import {Component, OnInit} from '@angular/core';
import { ProduitService } from '../../../services/produits/produit.service';
import {  CategorieService } from '../../../services/categories/categorie.service';
import { RouterLink } from '@angular/router';
import { Produit } from '../../../models/produit';
import { categorie } from '../../../models/categorie';
import { CommonModule ,NgOptimizedImage} from '@angular/common';
import { FormsModule } from '@angular/forms';
import {finalize} from "rxjs";

@Component({
  selector: 'app-all-products',
  standalone: true,
  imports: [RouterLink,CommonModule, NgOptimizedImage, FormsModule],
  templateUrl: './all-products.component.html',
  styleUrl: '../../produits/produits.component.scss'
})
export class AllProductsComponent implements OnInit{
  produits:Produit[]=[];
  list_categorie:categorie[]=[];
  selectedNew: string = '';
  selectedSpecial: string = '';
  isLoading = false;

  constructor(private produitService:ProduitService, private categorieService:CategorieService){}


  ngOnInit():void{
    this.isLoading = true;
    this.produitService.getProducts().pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (data:Produit[])=>{
        this.produits=data;
      },
      error: (error) => {
             console.log('Erreur lors de l affichage des produits :', error.error.detail);
      }
    })

    this.categorieService.getAllCategories().subscribe({
      next: (data:categorie[])=>{
        this.list_categorie=data
      },
      error: (error) => {
             console.log('Erreur lors de l affichage des categorie :', error.error.detail);
      }
    })
  }

  calculateHeight(image: any): number {
    const width = 300; // Largeur fixe que nous utilisons
    if (image.width && image.height) {
      const aspectRatio = image.height / image.width;
      return Math.round(width * aspectRatio);
    }
    return 300; // Hauteur par défaut si les dimensions ne sont pas disponibles
  }

}

