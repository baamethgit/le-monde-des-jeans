import { Component, inject, input } from '@angular/core';
import { CarouselModule} from 'primeng/carousel';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { NgOptimizedImage, SlicePipe } from '@angular/common';
import { ProduitService } from '../../services/produits/produit.service';
import { CommandeService } from '../../services/commandes/commande.service';
import { UserService } from '../../services/users/user.service';
import { Produit } from '../../models/produit';
import { PanierService } from '../../services/panier.service';


@Component({
  selector: 'app-produit-detail',
  standalone: true,
  imports: [SlicePipe, CarouselModule, RouterLink, NgOptimizedImage, RouterOutlet],
  templateUrl: './produit-detail.component.html',
  styleUrl: './produit-detail.component.scss'
})
export class ProduitDetailComponent {

  list_p: any[] = [];
  product_selected: Produit | undefined;
  must_like_product: Produit[] = [];
  commandeService = inject(CommandeService);
  panierService = inject(PanierService);
  userService = inject(UserService);
  responsiveOptions: any[] = [
    {

      breakpoint: '576px',
      numVisible: 1,
      numScroll: 1,
      circular: true,
      showIndicators: false
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private produitService: ProduitService,
    private router: Router
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
    this.produitService.getProductBySlug(slug).subscribe({
      next: (data: Produit) => {
        this.product_selected = data;
        this.list_p = this.product_selected.images;
        this.loadSimilarProducts();

acheterDirectement(productSlug : string | undefined){
  if(productSlug != undefined){
    this.commandeService.creerCommande(false,productSlug).subscribe({
      next:(data)=>{
        this.router.navigate(['/detail-commande']);
        this.errorMessage = '';
      },
      error : (error)=>{
        if(error.error.message_erreur)
          this.errorMessage = error.error.message_erreur;

      },
      error: (error) => {
        console.log('Erreur lors de l\'affichage du produit :', error.error.detail);
      }
    });
  }

  loadSimilarProducts(): void {
    if (this.product_selected?.categorie_detail?.slug) {
      const categorySlug = this.product_selected.categorie_detail.slug;
      this.produitService.getProductByCategory(categorySlug).subscribe({
        next: (data: Produit[]) => {
          this.must_like_product = data.filter(p => p.slug !== this.product_selected?.slug);
        },
        error: (error) => {
          console.log('Erreur lors de l\'affichage des produits similaires :', error.error.detail);
        }
      });
    } else {
      console.log('Aucun slug de catégorie disponible pour ce produit.');
    }
  }
addToCart(){
  this.panierService.ajouterProduit(this.product_selected?.slug || '').subscribe({
    next:(data)=>{
      this.router.navigate(['/panier']);
    },
    error : (error)=>{
      if(error.error.message_erreur)
        this.errorMessage = error.error.message_erreur;
    },
  })
}

  acheterDirectement(productSlug: string | undefined): void {
    if (productSlug) {
      this.commandeService.creerCommande(false, productSlug).subscribe({
        next: (data) => {
          // Handle successful order creation
        },
        error: (error) => {
          console.log('Erreur lors de la création de la commande :', error.error.detail);
        },
      });
    }
  }

  addToCart(): void {
    if (this.product_selected?.slug) {
      this.panierService.ajouterProduit(this.product_selected.slug).subscribe({
        next: (data) => {
          this.router.navigate(['/panier']);
        },
        error: (error) => {
          console.log('Erreur lors de l\'ajout au panier :', error.error.detail);
        },
      });
    }
  }
}

