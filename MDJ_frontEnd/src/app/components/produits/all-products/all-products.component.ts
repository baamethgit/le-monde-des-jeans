import { Component } from '@angular/core';
import { ProduitService } from '../../../services/produits/produit.service';
import {  CategorieService } from '../../../services/categories/categorie.service';
import { RouterLink } from '@angular/router';
import { Produit } from '../../../models/produit';
import { categorie } from '../../../models/categorie';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-all-products',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './all-products.component.html',
  styleUrl: '../../produits/produits.component.scss'
})
export class AllProductsComponent {
  produits:Produit[]=[];
  list_categorie:categorie[]=[];

  constructor(private produitService:ProduitService, private categorieService:CategorieService){}


  ngOnInit():void{
    this.produitService.getProducts().subscribe({
      next: (data:Produit[])=>{
        this.produits=data;
        console.log(this.produits)
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
}

