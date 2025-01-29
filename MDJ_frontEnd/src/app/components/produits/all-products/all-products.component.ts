import {Component, OnInit} from '@angular/core';
import { ProduitService } from '../../../services/produits/produit.service';
import {  CategorieService } from '../../../services/categories/categorie.service';
import { RouterLink } from '@angular/router';
import { Produit } from '../../../models/produit';
import { categorie } from '../../../models/categorie';
import { CommonModule ,NgOptimizedImage} from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import {finalize} from "rxjs";
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader";


@Component({
  selector: 'app-all-products',
  standalone: true,
  imports: [RouterLink, CommonModule, NgOptimizedImage, FormsModule, NgbPaginationModule, NgxSkeletonLoaderModule],
  templateUrl: './all-products.component.html',
  styleUrl: '../../produits/produits.component.scss'
})
export class AllProductsComponent implements OnInit{
  produits:Produit[]=[];
  paginateProduits:Produit[]=[];
  page = 1;
  pageSize = 20;
  totalItems = 0;
  list_categorie:categorie[]=[];
  selectedNew: string = '';
  selectedSpecial: string = '';
  isLoading = false;

  constructor(private readonly produitService:ProduitService, private readonly categorieService:CategorieService){}


  ngOnInit():void{
    this.loadProducts();
    this.categorieService.getAllCategories().subscribe({
      next: (data:categorie[])=>{
        this.list_categorie=data
      },
      error: (error) => {

      }
    })
  }

  loadProducts() {
    this.isLoading = true;
    this.produitService.getAllProducts(this.page, this.pageSize,"-id").pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (data)=>{
        this.produits=data.results;
        this.totalItems = data.count;
      },
      error: (error) => {
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

  onPageChange(page: number) {
    this.page = page;
    this.loadProducts();
  }

  onPageSizeChange(pageSize: number) {
    this.pageSize = pageSize;
    this.page = 1; // Retour à la première page quand on change la taille
    this.loadProducts();
  }

}

