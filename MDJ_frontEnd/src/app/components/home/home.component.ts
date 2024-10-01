import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { categorie, CategorieService } from '../../services/categories/categorie.service';
import { error } from 'console';
import { RouterLink } from '@angular/router';
import { Produit } from '../../models/produit';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  produits = input<Produit[]>
  catagorie_list:categorie[]=[];
  constructor(private categorie:CategorieService){}

  ngOnInit(){
    this.categorie.getAllCategories().subscribe({
      next:(data:categorie[])=>{this.catagorie_list=data},
      error:(error)=>{console.log('Erreur lors de l\'affichage des catégories :', error.error.detail)}
    })
  }
}
