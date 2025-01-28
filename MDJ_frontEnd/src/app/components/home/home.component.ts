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
import {NgxSkeletonLoaderComponent, NgxSkeletonLoaderModule} from "ngx-skeleton-loader";
import {finalize} from "rxjs";


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, NgOptimizedImage,NgxSkeletonLoaderModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent  implements OnInit{
  page = 1;
  pageSize = 10;
  totalItems = 0;
  isPSpeciauxLoading: boolean = true;
  isPLoading : boolean = true;
  isAvisLoading : boolean = true;

  catagorie_list:categorie[]=[];
  products_list:Produit[]=[];
  special_list:Produit[]=[];
  avis_list:Avis[]=[];
  infos:Infos | undefined;
  constructor(private readonly categorieService:CategorieService, private readonly productService:ProduitService, private readonly avisService: UserService, private readonly infosService:InfosService){}

  ngOnInit() {
    this.categorieService.getAllCategories().subscribe({
      next: (data: categorie[]) => {
        this.catagorie_list = data
      },
      error: (error) => {
      }
    })

    this.loadSpecials();
    this.loadProducts();

    this.loadInfos();
    this.loadAvis();

  }

  loadAvis():void{
    this.isAvisLoading=true;
      this.avisService.getAllAvis(this.page,this.pageSize).pipe(
      finalize(() => this.isAvisLoading = false)
    ).subscribe({
      next:(data)=>{
        this.avis_list=data.results;
      }

    })
  }

  loadProducts(){
    this.isPLoading = true;
    this.productService.getProducts(this.page, this.pageSize).pipe(
      finalize(() => this.isPLoading = false)
    ).subscribe({
      next:(data)=>{

        this.products_list=data.results;
        this.totalItems = data.count;
      },
      error:(error)=>{
      }
    })
  }

  loadSpecials(){
    this.isPSpeciauxLoading = true;
    this.productService.getProductBySpecial(this.page, this.pageSize).pipe(
      finalize(() => this.isPSpeciauxLoading = false)
    ).subscribe({
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
