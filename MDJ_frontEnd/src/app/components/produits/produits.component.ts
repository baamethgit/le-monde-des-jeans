import { Component, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { ProduitService } from '../../services/produits/produit.service';
import { CategorieService } from '../../services/categories/categorie.service';


@Component({
  selector: 'app-produits',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, NgOptimizedImage],
  templateUrl: './produits.component.html',
  styleUrl: './produits.component.scss'
})
export class ProduitsComponent implements OnInit {
  list_categorie: any[] = [];
  current_category: string = ''; // Par défaut, afficher tous les produits

  constructor(
    private produitService: ProduitService,
    private router: Router,
    private categorieService: CategorieService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Récupérer la liste des catégories
    this.categorieService.getAllCategories().subscribe({
      next: (data: any[]) => {
        this.list_categorie = data;
      },
      error: (error) => {
        //console.log('Erreur lors de l\'affichage des catégories :', error.error.detail);
      }
    });

    // Surveiller les changements de l'URL pour mettre à jour la catégorie active
    this.route.url.subscribe(() => {
      const slug = this.route.snapshot.firstChild?.paramMap.get('slug');
      this.current_category = slug ? slug : ''; // Si slug est null, tous les produits sont affichés
    });
  }

  onCategorySelect(event: Event): void {
    const categorySlug = (event.target as HTMLSelectElement).value;
    this.switch_category(categorySlug);
  }

  switch_category(categorySlug: string): void {
    this.current_category = categorySlug; // Mettre à jour la catégorie active

    // Si aucun slug n'est fourni (pour "Tous les produits"), rediriger vers la page principale des produits
    if (categorySlug === '') {
      this.router.navigate(['/produits']);
    } else {
      this.router.navigate(['/produits/categorie', categorySlug]);
    }
  }
}
