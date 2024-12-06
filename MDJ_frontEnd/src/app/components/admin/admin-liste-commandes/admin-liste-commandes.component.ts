import { AsyncPipe, CommonModule, DecimalPipe, JsonPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbHighlight, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { CommandesDirective, SortEvent } from '../../../directives/commandes.directive';
import { Commande } from '../../../models/commande';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { CommandeService } from '../../../services/commandes/commande.service';

@Component({
  selector: 'app-admin-liste-commandes',
  standalone: true,
  imports: [DecimalPipe,RouterLink, FormsModule, AsyncPipe, NgbHighlight, CommandesDirective, NgbPaginationModule,JsonPipe,CommonModule],
  templateUrl: './admin-liste-commandes.component.html',
  styleUrl: './admin-liste-commandes.component.scss'
})
export class AdminListeCommandesComponent implements OnInit{
  page = 1;
  pageSize = 5;
  searchTerm = '';
  totalItems = 0;
  totalPage = 10;
  isLoading : boolean = false;
  statutFiltre : string = '';
  commandes : Commande[] = [];
  filteredcommandes: Commande[] = [];
  dateFilter!: string;
  sanitizer = inject(DomSanitizer);


  commandeService = inject(CommandeService);

  ngOnInit(): void {
      this.loadCommandes();
  }

  highlightText(text: string): SafeHtml {
    if (!this.searchTerm) {
      return text;
    }
    const regex = new RegExp(`(${this.searchTerm})`, 'gi');
    const newText = text.replace(regex, "<strong class='searchresult'>$1</strong>");
    return this.sanitizer.bypassSecurityTrustHtml(newText);
  }

  onSearch(){
    this.page = 1;
    this.loadCommandes();
    console.log(this.searchTerm);
  }

  loadCommandes() : void{
    this.commandeService.getCommandes(this.page, this.pageSize, this.searchTerm).subscribe({
      next:(response)=>{
        this.commandes = response.results;
        this.totalItems = response.count;
      },
      error:(error)=>{
        console.log(error);
      }
    })
  }

  onSort({ column, direction }: SortEvent) {
		// resetting other headers
		// this.headers.forEach((header) => {
		// 	if (header.sortable !== column) {
		// 		header.direction = '';
		// 	}
		// });

		// this.service.sortColumn = column;
		// this.service.sortDirection = direction;
	}

  onStatusFilterChange(event: Event) {
    this.statutFiltre = (event.target as HTMLSelectElement).value;
    this.loadCommandes();
  }

  onDateFilterChange(event: Event) {
    this.loadCommandes();
  }

  viewOrder(orderId: string) {
    console.log(`Viewing order ${orderId}`);
    // Implémentez la logique pour afficher les détails de la commande
  }

  editOrder(orderId: string) {
    console.log(`Editing order ${orderId}`);
    // Implémentez la logique pour éditer la commande
  }
}
