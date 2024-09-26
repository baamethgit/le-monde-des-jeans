import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/users/user.service';
import { User } from '../../../models/user';
import { CommonModule } from '@angular/common';
import { UpdateUserComponent } from '../update-user/update-user.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule,UpdateUserComponent,RouterLink],
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
    this.userService.getUsers().subscribe({
      next:(users) => {
        this.users = users;
        // console.log(this.users);
      },
      error:(error) => {
        console.error('Erreur lors du chargement des utilisateurs', error);
      }
    });
    // this.users = this.userService.getUsers();
  }
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
