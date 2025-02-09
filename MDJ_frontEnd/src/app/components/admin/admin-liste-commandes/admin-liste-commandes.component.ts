import { CommonModule, } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {  NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import {  SortEvent } from '../../../directives/commandes.directive';
import { Commande } from '../../../models/commande';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { CommandeService } from '../../../services/commandes/commande.service';
import { StatutCommande } from '../../../models/StatutCommande';
import {finalize} from "rxjs";
import { log } from 'console';

@Component({
  selector: 'app-admin-liste-commandes',
  standalone: true,
  imports: [RouterLink, FormsModule, NgbPaginationModule,CommonModule],
  templateUrl: './admin-liste-commandes.component.html',
  styleUrl: './admin-liste-commandes.component.scss'
})
export class AdminListeCommandesComponent implements OnInit{
  page = 1;
  pageSize = 200;
  searchTerm = '';
  protected readonly StatutCommande = StatutCommande;
  totalItems = 0;
  isLoading : boolean = false;
  statutFiltre : string = '';
  commandes : Commande[] = [];
  sanitizer = inject(DomSanitizer);
  startDate! : Date;
  endDate! : Date;
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
  }


  loadCommandes() : void{
    this.isLoading = true;
    this.commandeService.getCommandes(this.page, this.pageSize, this.searchTerm,this.statutFiltre,this.startDate,this.endDate)
      .pipe(
        finalize(() => this.isLoading = false)
      ).subscribe({
      next:(response)=>{
        this.commandes = response.results;
        this.totalItems = response.count;
      }
    })
  }

  OnPageChange(page: number) {
    this.page = page;
    this.loadCommandes();
    window.scrollTo(0, 0);
  }

  onDateFilterChange(event: Event) {
    this.page = 1;
    this.loadCommandes();
  }

  openDeleteCommandeModal(id:number){
    const confirmed = confirm("étes vous sur de vouloir supprimer");
    if (confirmed){
    this.commandeService.supprimerCommandeParAdmin(id).subscribe({
      next:(data)=>{
        // this.alertMessage = 'Votre commande est supprimé'
      },
      error:(error)=>{

      }
    })
  }}
}
