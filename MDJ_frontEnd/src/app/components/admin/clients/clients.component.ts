import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../../services/users/user.service';
import { User } from '../../../models/user';
import { CommonModule } from '@angular/common';
import { NgbHighlight, NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from '../../loader/loader.component';
import { DeleteModalComponent } from '../delete-modal/delete-modal.component';
import {finalize} from "rxjs";

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule,FormsModule, NgbHighlight, NgbPaginationModule,LoaderComponent],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class ClientsComponent implements OnInit {
  users: User[] = [];
  page = 1;
  isLoading: boolean = false;
  isUpdateLoading: boolean = false;
  pageSize = 50;
  searchTerm = '';
  totalItems = 0;
  modalService = inject(NgbModal);
  constructor(private readonly userService: UserService) {}

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
      }
    });
  }

  onSearch(){
    this.page = 1;
    this.loadUsers();
  }

  OnPageChange(page: number) {
    this.page = page;
    this.loadUsers();
    window.scrollTo(0, 0);
  }


  deleteUser(id:number){
    const modalRef = this.modalService.open(DeleteModalComponent, { size: 'lg',centered:true, backdrop: 'static' });
    modalRef.componentInstance.id = id;
    modalRef.result.then(
      () => this.loadUsers(),
      () => {}
    );
  }

  errorUpdate = "";

  UserToAdmin(user:any):void{

    const confirmed = confirm(`êtes-vous sûr de vouloir donner le role d'admin à ${user.nom_complet}`);
    if(confirmed){
      this.isUpdateLoading = true;
      this.userService.ClientToAdmin(user.id).pipe(
        finalize(() => this.isUpdateLoading = false)
      ).subscribe({
        next: (response) => {
          this.loadUsers();
        },
        error: (error) => {
          this.errorUpdate = "erreur lors de la mis à jour de l'utilisateur"
        }
      });

    }
  }


  AdminToUser(user:any):void{
    const confirmed = confirm(`êtes-vous sûr de vouloir retirer le role d'admin à ${user.nom_complet}`);
    if (confirmed){
      this.isUpdateLoading = true;

      this.userService.AdminToClient(user.id).pipe(
        finalize(() => this.isUpdateLoading = false)
      ).subscribe({
        next: (response) => {
          this.loadUsers();
        },
        error: (error) => {
          this.errorUpdate = "erreur lors de la mis à jour de l'utilisateur"
        }
      });
    }else{

    }
    }


  ActiveDesactiveClient(user:any):void{
    const confirmed = confirm(`êtes-vous sûr de vouloir ${!user.is_active?'activer':'desactiver'} le compte de ${user.phone_number}`);
    if(confirmed){
      this.isUpdateLoading = true;

      this.userService.ActiveDesactiveClient(user.id).pipe(
        finalize(() => this.isUpdateLoading = false)
      ).subscribe({
        next: (response) => {
          this.loadUsers();
        },
        error: (error) => {
          this.errorUpdate = "erreur lors de la mis à jour de l'utilisateur"
        }
      });

    }
     }
}
