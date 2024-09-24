import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';

interface Review {
  id: number;
  clientName: string;
  date: Date;
  rating: number;
  content: string;
}
const FILTER_PAG_REGEX = /[^0-9]/g;

@Component({
  selector: 'app-admin-avis-clients',
  standalone: true,
  imports: [CommonModule, NgbPagination],
  templateUrl: './admin-avis-clients.component.html',
  styleUrl: './admin-avis-clients.component.scss'
})
export class AdminAvisClientsComponent {
  reviews: Review[] = [
    {
      id: 1,
      clientName: "Sophie Dupont",
      date: new Date("2024-03-15"),
      rating: 5,
      content: "J'adore ce site ! La livraison a été super rapide et le produit est exactement comme décrit. Je recommande vivement !"
    },
    {
      id: 2,
      clientName: "Thomas Martin",
      date: new Date("2024-03-10"),
      rating: 2,
      content: "Déçu par la qualité du produit reçu. Ne correspond pas du tout à la description. Le service client a été difficile à joindre."
    },
    {
      id: 3,
      clientName: "Emma Lefebvre",
      date: new Date("2024-03-05"),
      rating: 4,
      content: "Bonne expérience globale. Le produit est de bonne qualité, mais la livraison a pris un peu plus de temps que prévu."
    },
    {
      id: 4,
      clientName: "Lucas Moreau",
      date: new Date("2024-02-28"),
      rating: 3,
      content: "Produit correct mais rien d'extraordinaire. Le rapport qualité-prix pourrait être meilleur."
    },
    {
      id: 5,
      clientName: "Chloé Petit",
      date: new Date("2024-02-20"),
      rating: 5,
      content: "Wow ! Service exceptionnel et produit de haute qualité. Je suis client depuis des années et je n'ai jamais été déçu. Continuez comme ça !"
    },
    {
      id: 6,
      clientName: "Antoine Dubois",
      date: new Date("2024-02-15"),
      rating: 1,
      content: "Expérience catastrophique. Produit jamais reçu et aucune réponse du service client. Je ne recommande pas du tout."
    },
    {
      id: 7,
      clientName: "Marie Rousseau",
      date: new Date("2024-02-10"),
      rating: 4,
      content: "Très satisfaite de mon achat. Le site est facile à utiliser et la livraison a été rapide. Petit bémol sur l'emballage qui était un peu abîmé."
    }
  ];
  deleteReview(id: number): void {
    // Implémentez la logique de suppression ici
    console.log(`Suppression de l'avis avec l'ID ${id}`);
    this.reviews = this.reviews.filter(review => review.id !== id);
  }

  page = 1;
  pageSize = 2;
  get paginatedCommentaires(): Review[] {
    const start = (this.page - 1) * this.pageSize; // Calcul de l'index de début
    return this.reviews.slice(start, start + this.pageSize); // Retourne les commentaires pour la page actuelle
  }

  get totalPages(): number {
    return Math.ceil(this.reviews.length / this.pageSize);
  }

  selectPage(page: string | number): void {
    if (typeof page === 'number') {
      page = page.toString();
    }
    this.page = parseInt(page, 10) || 1;
  }

  formatInput(input: HTMLInputElement) {
    input.value = input.value.replace(FILTER_PAG_REGEX, '');
  }
}
