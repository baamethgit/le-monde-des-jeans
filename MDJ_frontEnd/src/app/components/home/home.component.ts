import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CategorieService } from '../../services/categories/categorie.service';
import { error } from 'console';
import { RouterLink } from '@angular/router';
import { categorie } from '../../models/categorie';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  catagorie_list:categorie[]=[];
  constructor(private categorie:CategorieService){}

  ngOnInit(){
    this.categorie.getAllCategories().subscribe({
      next:(data:categorie[])=>{this.catagorie_list=data},
      error:(error)=>{console.log('Erreur lors de l\'affichage des catégories :', error.error.detail)}
    })
  }
}
