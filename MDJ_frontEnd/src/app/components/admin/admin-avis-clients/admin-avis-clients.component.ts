import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../services/users/user.service';
import { Avis } from '../../../models/Avis';


const FILTER_PAG_REGEX = /[^0-9]/g;

@Component({
  selector: 'app-admin-avis-clients',
  standalone: true,
  imports: [CommonModule, NgbPagination],
  templateUrl: './admin-avis-clients.component.html',
  styleUrl: './admin-avis-clients.component.scss'
})
export class AdminAvisClientsComponent implements OnInit{
  reviews : Avis[] = [];
  message : string = '';
  page = 1;
  pageSize = 2;

  avisService = inject(UserService);
  constructor(){}


  ngOnInit(): void {
    this.loadAvis();
  }


  deleteReview(id: number): void {
    this.avisService.deleteAvis(id).subscribe({
      next:(data)=>{
        this.message = 'Avis supprimé';
        this.loadAvis();
      }
    })
  }

  loadAvis():void{
    this.avisService.getAllAvis().subscribe({
      next:(data)=>{
        this.reviews = data;
      }
    })
  }

  get paginatedCommentaires(): Avis[] {
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
