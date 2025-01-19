import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../../services/users/user.service';
import { User } from '../../../models/user';
import { CommonModule } from '@angular/common';
import { UpdateUserComponent } from '../update-user/update-user.component';
import { RouterLink } from '@angular/router';
import { NgbHighlight, NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { DetailClientComponent } from '../detail-client/detail-client.component';
import { LoaderComponent } from '../../loader/loader.component';
import { DeleteModalComponent } from '../delete-modal/delete-modal.component';
import {finalize} from "rxjs";

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterLink, NgbHighlight, NgbPaginationModule,DetailClientComponent,LoaderComponent],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class ClientsComponent implements OnInit {
  users: User[] = [];
  page = 1;
  isLoading: boolean = false;
  pageSize = 20;
  searchTerm = '';
  totalItems = 0;
  modalService = inject(NgbModal);
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.userService.getUsers(this.page, this.pageSize, this.searchTerm).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (response) => {
        this.users = response.results;
        this.totalItems = response.count;
      },
      error: (error) => {
        // console.error('Erreur lors du chargement des utilisateurs', error);
      }
    });
  }

  onSearch(){
    this.page = 1;
    this.loadUsers();
  }

  onPageSizeChange() {
    this.page = 1;
    this.loadUsers();
  }

  viewOrders(customer_phone:string){

  }
  editUser(customer_id:number){

  }
  deleteUser(slug:string){
    const modalRef = this.modalService.open(DeleteModalComponent, { size: 'lg',centered:true, backdrop: 'static' });

    modalRef.componentInstance.slug = slug;
    modalRef.result.then(
      () => this.loadUsers(),
      () => {}
    );
  }

}
