import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/user';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../../services/users/user.service';
import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../loader/loader.component';

@Component({
  selector: 'app-detail-client',
  standalone: true,
  imports: [CommonModule,RouterLink,LoaderComponent],
  templateUrl: './detail-client.component.html',
  styleUrl: './detail-client.component.scss'
})
export class DetailClientComponent implements OnInit{
  client: User | undefined;
  slug_client: string = '';
  isLoading : boolean = true;


  constructor(private route: ActivatedRoute, private userService: UserService, private router: Router){}
  ngOnInit(): void {
    this.slug_client = this.route.snapshot.params['slug'];

    this.userService.getUserByphoneNumber(this.slug_client).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (data) => {
        this.client = data;
      },
    error:(error)=>{

    }})
}
}
