import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../services/users/user.service';
import { Avis } from '../../../models/Avis';
import {finalize} from "rxjs";
import { FormsModule } from '@angular/forms';


const FILTER_PAG_REGEX = /[^0-9]/g;

@Component({
  selector: 'app-admin-avis-clients',
  standalone: true,
  imports: [CommonModule, NgbPagination, FormsModule],
  templateUrl: './admin-avis-clients.component.html',
  styleUrl: './admin-avis-clients.component.scss'
})
export class AdminAvisClientsComponent implements OnInit{
  reviews : Avis[] = [];
  message : string = '';
  page = 1;
  pageSize = 20;
  totalItems = 0;
  isLoading : boolean = false;

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
    this.isLoading = true;
    this.avisService.getAllAvis(this.page, this.pageSize).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next:(data)=>{
        this.reviews = data.results;
        this.totalItems = data.count;
      }
    })
  }



  formatInput(input: HTMLInputElement) {
    input.value = input.value.replace(FILTER_PAG_REGEX, '');
  }

  OnPageChange(page: number) {
    this.page = page;
    this.loadAvis();
  }

}
