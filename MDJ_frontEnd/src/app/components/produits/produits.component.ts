import { Component, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import {ActivatedRoute, Router, RouterLink, RouterOutlet} from '@angular/router';
import { CategorieService } from '../../services/categories/categorie.service';
import { FormsModule } from '@angular/forms';
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader";
import {finalize} from "rxjs";


@Component({
  selector: 'app-produits',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterOutlet, NgOptimizedImage, NgxSkeletonLoaderModule],
  templateUrl: './produits.component.html',
  styleUrl: './produits.component.scss'
})
export class ProduitsComponent implements OnInit {
  list_categorie: any[] = [];
  selectedCategory: string = '';
  isCategoriesLoading : boolean = true;

  constructor(
    private readonly router: Router,
    private readonly categorieService: CategorieService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {

this.loadCategories();
    this.route.params.subscribe(params => {
      const slug = this.route.snapshot.firstChild?.paramMap.get('slug');
      if (slug == null) {
        this.selectedCategory = '';
        return;
      }
      this.selectedCategory = slug;
    });
  }

  loadCategories():void{
    this.isCategoriesLoading = true;
    this.categorieService.getAllCategories().pipe(
      finalize(() => this.isCategoriesLoading = false)
    ).subscribe({
      next: (data: any[]) => {
        this.list_categorie = data;
      }
    });
  }

  switch_category(categorySlug: string): void {
    this.selectedCategory = categorySlug;

    if (categorySlug === '') {
      this.router.navigate(['/produits']);
    } else {
      this.router.navigate(['/produits/categorie', categorySlug]);
    }
  }

  onCategorySelect(categorySlug: string): void {
    this.selectedCategory = categorySlug;
    this.switch_category(categorySlug);
    console.log('Category selected:', categorySlug);
}
}
