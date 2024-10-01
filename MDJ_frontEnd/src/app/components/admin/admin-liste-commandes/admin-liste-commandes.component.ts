import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbHighlight, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { CommandesDirective, SortEvent } from '../../../directives/commandes.directive';
import { Commande } from '../../../models/commande';

@Component({
  selector: 'app-admin-liste-commandes',
  standalone: true,
  imports: [DecimalPipe, FormsModule, AsyncPipe, NgbHighlight, CommandesDirective, NgbPaginationModule],
  templateUrl: './admin-liste-commandes.component.html',
  styleUrl: './admin-liste-commandes.component.scss'
})
export class AdminListeCommandesComponent implements OnInit{
  page = 1;
  pageSize = 5;
  searchTerm = '';
  totalItems = 0;
  isLoading : boolean = false;
  commandes : Commande[] = [];

  ngOnInit(): void {
      
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
}
