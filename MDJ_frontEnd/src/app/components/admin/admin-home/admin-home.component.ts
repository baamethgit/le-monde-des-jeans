import {Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';
import { AdminHeaderComponent } from '../admin-header/admin-header.component';
import {UserService} from "../../../services/users/user.service";
import {User} from "../../../models/user";
import {finalize} from "rxjs";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [RouterOutlet, AdminSidebarComponent, AdminHeaderComponent, NgIf],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.scss'
})
export class AdminHomeComponent implements OnInit{
  isAuthenticated = false;
  isAdmin = false;
  isLoading = true;

  constructor(private router:Router,private route:ActivatedRoute,private userService:UserService){
    if(this.route.toString().endsWith('mdj_admin')){
      this.router.navigate(['mdj_admin/dashboard']);
    }

  }

  ngOnInit() {
    this.isLoading = true;
    this.userService.getUser().pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (data) => {
        this.isAuthenticated = true;
        this.isAdmin = (data.is_staff && data.is_superuser) || false;
      },
      error: (error) => {
        this.isAuthenticated = false;
        this.isAdmin = false;
        this.router.navigate(['**']);
      }
    })
  }

}
