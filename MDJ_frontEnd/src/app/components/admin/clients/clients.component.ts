import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/users/user.service';
import { User } from '../../../models/user';
import { CommonModule } from '@angular/common';
import { UpdateUserComponent } from '../update-user/update-user.component';
import { RouterLink } from '@angular/router';
import { NgbHighlight, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule,FormsModule,UpdateUserComponent,RouterLink, NgbHighlight, NgbPaginationModule],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class ClientsComponent implements OnInit {
  users: User[] = [];
  page = 1;
  pageSize = 5;
  searchTerm = '';
  totalItems = 0;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers(this.page, this.pageSize, this.searchTerm).subscribe({
      next: (response) => {
        this.users = response.results;
        this.totalItems = response.count;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des utilisateurs', error);
      }
    });
  }

  onSearch(){
    this.page = 1;
    this.loadUsers();
  }
  // onPageSizeChange() {
  //   this.page = 1; // Réinitialiser à la première page lors du changement de taille de page
  //   this.loadUsers();
  // }

  viewOrders(customer_phone:string){

  }
  editUser(customer_id:number){

  }
  deleteUser(phone_number:string){
    this.userService.deleteUser(phone_number).subscribe({
      next: (data) => {
        console.log('user supprimé avec succés')
      },
      error: (error) => {
        console.log(error.error);
      }
    });
  }

}
