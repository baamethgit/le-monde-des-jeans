import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';

import { CategorieService } from '../../services/categories/categorie.service';
import { error } from 'console';
import { RouterLink } from '@angular/router';
import { Produit } from '../../models/produit';
import { categorie } from '../../models/categorie';
import { ProduitService } from '../../services/produits/produit.service';
import { Avis } from '../../models/temoignage';
import { UserService } from '../../services/users/user.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, NgOptimizedImage],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  catagorie_list:categorie[]=[];
  products_list:Produit[]=[];
  avis_list:Avis[]=[];
  limit_prod=10;
  constructor(private categorieService:CategorieService, private productService:ProduitService, private avisService: UserService){}

  ngOnInit(){
    this.categorieService.getAllCategories().subscribe({
      next:(data:categorie[])=>{this.catagorie_list=data},
      error:(error)=>{console.log('Erreur lors de l\'affichage des catégories :', error.error.detail)}
    })

    this.productService.getProducts().subscribe({
      next:(data)=>{
        this.products_list=data;
        console.log(this.products_list)
      },
      error:(error)=>{console.log('Erreur lors de l\'affichage des produits :', error.error.detail)}
    })


    this.avisService.getAllAvis().subscribe({
      next:(data)=>{this.avis_list=data}
    })

  }
}
