import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/users/user.service';
import { User } from '../../../models/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class ClientsComponent implements OnInit {
  users: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    // this.userService.getUsers().subscribe({
    //   next:(users) => {
    //     this.users = users;
    //   },
    //   error:(error) => {
    //     console.error('Erreur lors du chargement des utilisateurs', error);
    //   }
    // });
    this.users = this.userService.getUsers();
  }
  viewOrders(customer_id:number){

  }
  editUser(customer_id:number){

  }
  deleteUser(customer_id:number){

  }
}