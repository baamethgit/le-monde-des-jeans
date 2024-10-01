import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbHighlight, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { CommandesDirective, SortEvent } from '../../../directives/commandes.directive';
import { Commande } from '../../../models/commande';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-liste-commandes',
  standalone: true,
  imports: [DecimalPipe,RouterLink, FormsModule, AsyncPipe, NgbHighlight, CommandesDirective, NgbPaginationModule],
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
  dateFiltre! : Date;
  statutFiltre : string = '';
  commandes : Commande[] = [];
  filteredcommandes: Commande[] = [];
  statusFilter: string = '';
  dateFilter: string = '';
  sanitizer = inject(DomSanitizer);


  ngOnInit(): void {
      this.loadcommandes();
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
  }

  loadCommandes() : void{
    
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



  loadcommandes() {
    // Ici, vous feriez normalement un appel à un service pour récupérer les commandes
    // Pour cet exemple, nous utilisons des données statiques
    // this.commandes = [
    //   { id: '#12345', customer: 'Jean Dupont', date: '2024-03-15', amount: 129.99, status: 'pending' },
    //   { id: '#12346', customer: 'Marie Martin', date: '2024-03-14', amount: 89.50, status: 'processing' },
    //   // Ajoutez d'autres commandes ici
    // ];
    this.applyFilters();
  }

  applyFilters() {
    this.filteredcommandes = this.commandes.filter(order => {
      return 
        // (this.searchTerm === '' || 
        //  order.id.includes(this.searchTerm) || 
        //  order.customer.toLowerCase().includes(this.searchTerm.toLowerCase())) &&
        // (this.statusFilter === '' || order.status === this.statusFilter) &&
        // (this.dateFilter === '' || order.date === this.dateFilter)
    });
  }

  onSearchChange() {
    this.applyFilters();
  }

  onStatusFilterChange(event: Event) {
    this.statusFilter = (event.target as HTMLSelectElement).value;
    this.applyFilters();
  }

  onDateFilterChange(event: Event) {
    this.dateFilter = (event.target as HTMLInputElement).value;
    this.applyFilters();
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
