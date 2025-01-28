import {Component, inject, OnInit} from '@angular/core';
import { CarouselModule} from 'primeng/carousel';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { ProduitService } from '../../services/produits/produit.service';
import { CommandeService } from '../../services/commandes/commande.service';
import { UserService } from '../../services/users/user.service';
import { Produit } from '../../models/produit';
import { PanierService } from '../../services/panier.service';
import { GalleriaModule } from 'primeng/galleria';
import { FormsModule } from '@angular/forms';
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader";
import {finalize} from "rxjs";


@Component({
  selector: 'app-produit-detail',
  standalone: true,
<<<<<<< HEAD
  imports: [CarouselModule, RouterLink, NgOptimizedImage, GalleriaModule,FormsModule],
=======
    imports: [SlicePipe, CarouselModule, RouterLink, NgOptimizedImage, RouterOutlet, GalleriaModule, FormsModule, NgxSkeletonLoaderModule],
>>>>>>> 9b3677841ef8f6c50420a767ed20a12d34ebf9d1
  templateUrl: './produit-detail.component.html',
  styleUrl: './produit-detail.component.scss'
})
export class ProduitDetailComponent implements OnInit{

  list_p: any[] = [];
  product_selected: Produit | undefined;
  must_like_product: Produit[] = [];
  page = 1;
  pageSize = 5;
  commandeService = inject(CommandeService);
  panierService = inject(PanierService);
  userService = inject(UserService);
  errorMessage = '';
  quantity: number = 1;
  isLoading = false;

responsiveOptions = [
  {
    breakpoint: '1024px',
    numVisible: 5,
    showThumbnails: true
  },
  {
    breakpoint: '768px',
    numVisible: 3,
    showThumbnails: false
  },
  {
    breakpoint: '560px',
    numVisible: 1,
    showThumbnails: false
  }
];


  constructor(
    private readonly route: ActivatedRoute,
    private readonly produitService: ProduitService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        this.loadProduct(slug);
      }
    });
  }

  loadProduct(slug: string): void {
    this.isLoading = true;
    this.produitService.getProductBySlug(slug).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (data: Produit) => {
        this.product_selected = data;
        this.list_p = data.images;
        this.loadSimilarProducts();
      }
    });
}

incrementQuantity() {
  if (this.product_selected && this.quantity < this.product_selected.QuantiteStock) {
    this.quantity++;
  }
}

decrementQuantity() {
  if (this.quantity > 1) {
    this.quantity--;
  }
}

acheterDirectement(productSlug : string | undefined){
  if(productSlug != undefined){
    this.commandeService.creerCommande(false,productSlug).subscribe({
      next:(data)=>{
        this.router.navigate(['/detail-commande']);
        this.errorMessage = '';
      },
      error : (error)=>{
        if(error.error.message_erreur)
          this.errorMessage = "Vous avez une commande en attente,veuillez la valider d'abord .";
      }
    });
  }}

  loadSimilarProducts(): void {
    if (this.product_selected?.categorie_detail?.slug) {
      const categorySlug = this.product_selected.categorie_detail.slug;
      this.produitService.getProductByCategory(categorySlug, this.page, this.pageSize).subscribe({
        next: (data) => {
          this.must_like_product = data.results.filter((p: { slug: string | undefined; }) => p.slug !== this.product_selected?.slug);
        }
      });
    } else { /* empty */ }
  }

  addToCart(): void {
    if (this.product_selected?.slug) {
      this.panierService.ajouterProduit(this.product_selected.slug).subscribe({
        next: (data) => {
          this.router.navigate(['/panier']);
        }
      });
    }
  }
}

