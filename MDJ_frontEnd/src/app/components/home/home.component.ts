import { CommonModule, NgOptimizedImage } from '@angular/common';
import {Component, OnInit} from '@angular/core';

import { CategorieService } from '../../services/categories/categorie.service';
import { RouterLink } from '@angular/router';
import { Produit } from '../../models/produit';
import { categorie } from '../../models/categorie';
import { ProduitService } from '../../services/produits/produit.service';
import { UserService } from '../../services/users/user.service';
import { Avis, AvisCreationData } from '../../models/Avis';
import { Infos } from '../../models/infos.module';
import { InfosService } from '../../services/infos.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, NgOptimizedImage],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent  implements OnInit{
  page = 1;
  pageSize = 10;
  totalItems = 0;

  catagorie_list:categorie[]=[];
  products_list:Produit[]=[];
  special_list:Produit[]=[];
  avis_list:Avis[]=[];
  infos:Infos | undefined;
  constructor(private readonly categorieService:CategorieService, private readonly productService:ProduitService, private readonly avisService: UserService, private readonly infosService:InfosService){}

  ngOnInit(){
    this.categorieService.getAllCategories().subscribe({
      next:(data:categorie[])=>{this.catagorie_list=data},
      error:(error)=>{
      }
    })

    this.productService.getProducts(this.page, this.pageSize).subscribe({
      next:(data)=>{

        this.products_list=data.results;
        this.totalItems = data.count;
       },
      error:(error)=>{
      }
    })

    this.loadSpecials();

    this.loadInfos();


    this.avisService.getAllAvis(this.page,this.pageSize).subscribe({
      next:(data)=>{
        this.avis_list=data.results;
      }
    })

  }

  loadSpecials(){
    this.productService.getProductBySpecial(this.page, this.pageSize).subscribe({
      next:(data)=>{this.special_list=data.results}
    })
  }

  loadInfos(): void {
    this.infosService.getInfos().subscribe(
      {
        next: (data) => {
          this.infos = data;
        }
      }
    )
  }

  createAvis(newAvis:AvisCreationData){
    this.avisService.addAvis(newAvis).subscribe({
      next:(data)=>{
      }
    })
  }
}
