import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';

import { CategorieService } from '../../services/categories/categorie.service';
import { RouterLink } from '@angular/router';
import { Produit } from '../../models/produit';
import { categorie } from '../../models/categorie';
import { ProduitService } from '../../services/produits/produit.service';
import { UserService } from '../../services/users/user.service';
import { Avis, AvisCreationData } from '../../models/Avis';


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
  special_list:Produit[]=[];
  avis_list:Avis[]=[];
  limit_prod=10;
  constructor(private readonly categorieService:CategorieService, private readonly productService:ProduitService, private readonly avisService: UserService){}

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

    this.loadSpecials();


    this.avisService.getAllAvis().subscribe({
      next:(data)=>{this.avis_list=data}
    })

  }

  loadSpecials(){
    this.productService.getProductBySpecial().subscribe({
      next:(data)=>{this.special_list=data}
    })
  }

  createAvis(newAvis:AvisCreationData){
    this.avisService.addAvis(newAvis).subscribe({
      next:(data)=>{
        console.log('avis ajouté avec succés');
      }
    })
  }
}
