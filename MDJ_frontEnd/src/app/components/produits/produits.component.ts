import { Component, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { CategorieService } from '../../services/categories/categorie.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-produits',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NgOptimizedImage, FormsModule],
  templateUrl: './produits.component.html',
  styleUrl: './produits.component.scss'
})
export class ProduitsComponent implements OnInit {
  list_categorie: any[] = [];
  current_category: string = ''; 
  selectedCategory: string = '';

  constructor(
    private readonly router: Router,
    private readonly categorieService: CategorieService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.categorieService.getAllCategories().subscribe({
      next: (data: any[]) => {
        this.list_categorie = data;
      }
    });

    this.route.params.subscribe(params => {
      const slug = this.route.snapshot.firstChild?.paramMap.get('slug');
      this.current_category = <string>slug;
      this.selectedCategory = <string>slug;
    });
  }

  switch_category(categorySlug: string): void {
    this.current_category = categorySlug;
    this.selectedCategory = categorySlug; 

    if (categorySlug === '') {
      this.router.navigate(['/produits']);
    } else {
      this.router.navigate(['/produits/categorie', categorySlug]);
    }
  }

  onCategorySelect(event: any): void {
    const categorySlug = event.target.value;
    this.switch_category(categorySlug);
  }
}