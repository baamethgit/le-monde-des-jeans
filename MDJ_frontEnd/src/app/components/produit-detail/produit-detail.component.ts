import {Component, Inject, inject, OnInit, PLATFORM_ID} from '@angular/core';
import { CarouselModule} from 'primeng/carousel';
import {ActivatedRoute, Router, RouterLink, RouterOutlet} from '@angular/router';
import {isPlatformBrowser, NgOptimizedImage, SlicePipe} from '@angular/common';
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
    imports: [SlicePipe, CarouselModule, RouterLink, NgOptimizedImage, RouterOutlet, GalleriaModule, FormsModule, NgxSkeletonLoaderModule,
      CarouselModule, RouterLink, NgOptimizedImage, GalleriaModule,FormsModule],
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
  isAchatDirectLoading = false;
  isAddToCartLoading = false;

responsiveOptions = [
  {
    breakpoint: '1024px',
    numVisible: 4,
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

  private isBrowser: boolean;


  constructor(
    private readonly route: ActivatedRoute,
    private readonly produitService: ProduitService,
    private readonly router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

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
    this.isAchatDirectLoading = true;
    this.commandeService.creerCommande(false,productSlug).pipe(
      finalize(
        ()=>{
          this.isAchatDirectLoading = false;
        }
      )
    ).subscribe({
      next:(data)=>{
        this.router.navigate(['/detail-commande']);
        this.errorMessage = '';
      },
      error : (error)=>{
        if (error.status === 409) {
          alert("Le produit est en rupture de stock");
          if(this.isBrowser){
            window.location.reload();
          }
        }else if(error.error.message_erreur){
          this.errorMessage = "Vous avez une commande en attente,veuillez la valider d'abord .";
        }else{
          alert("Une erreur innatendu est survenu.");
          if(this.isBrowser){
            window.location.reload();
          }
        }
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
      this.isAddToCartLoading = true;
      this.panierService.ajouterProduit(this.product_selected.slug).pipe(
        finalize(
          ()=>{
            this.isAddToCartLoading = false;
          }
        )
      ).subscribe({
        next: (data) => {
          this.router.navigate(['/panier']);
        },
        error : (error)=>{
          if (error.status === 409) {
            alert("Le produit est en rupture de stock");
            if(this.isBrowser){
              window.location.reload();
            }
          }else{
            alert("Une erreur innatendu est survenu.");
            if(this.isBrowser){
              window.location.reload();
            }
          }
        }
      });
    }
  }
}

