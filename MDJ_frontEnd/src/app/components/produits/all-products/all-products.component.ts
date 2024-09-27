import { Component } from '@angular/core';
import { Produit, ProduitService } from '../../../services/produits/produit.service';
import { categorie, CategorieService } from '../../../services/categories/categorie.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-all-products',
  standalone: true,
  imports: [RouterLink],
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
        this.produits=data
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

