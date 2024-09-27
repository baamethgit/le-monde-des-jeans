import { Component } from '@angular/core';
import { Produit, ProduitService } from '../../../services/produits/produit.service';
import { ActivatedRoute, Route, RouterLink } from '@angular/router';
import { CategorieService } from '../../../services/categories/categorie.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-filter',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './product-filter.component.html',
  styleUrl: '../../produits/produits.component.scss'
})
export class ProductFilterComponent {
  produits_category: Produit[] = [];
  current_category: string = '';
  private routeSub: Subscription | undefined;

constructor(private produitService:ProduitService, private categorieService:CategorieService, private route:ActivatedRoute){}

ngOnInit(): void {
  // Écouter les changements de paramètres de route
  this.routeSub = this.route.paramMap.subscribe(params => {
    const categorieSlug = params.get('slug');
    if (categorieSlug) {
      this.current_category = categorieSlug;
      this.loadProductsByCategory(categorieSlug);
    }
  });
}

// Charger les produits par catégorie
loadProductsByCategory(categorieSlug: string): void {
  this.produitService.getProductByCategory(categorieSlug).subscribe({
    next: (data: Produit[]) => {
      this.produits_category = data;
    },
    error: (error) => {
      console.error('Erreur lors de la récupération des produits :', error);
    }
  });
}

ngOnDestroy(): void {
  // Désabonnement pour éviter les fuites de mémoire
  if (this.routeSub) {
    this.routeSub.unsubscribe();
  }
}
}
