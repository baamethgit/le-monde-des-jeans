import { Component } from '@angular/core';
import { UserService } from '../../services/users/user.service';
import { Avis } from '../../models/Avis';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-avis',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbPagination],
  templateUrl: './avis.component.html',
  styleUrl: './avis.component.scss'
})
export class AvisComponent {
Avis:Avis[]=[];
pageSize: number = 20;
totalItems: number = 0;
page: number = 1;

  constructor(private readonly userService:UserService){}

ngOnInit():void{
    this.loadAvis();
}

loadAvis():void{
  this.userService.getAllAvis(this.page,this.pageSize).subscribe({
    next:(data)=>{
      this.Avis=data.results;
      this.totalItems=data.count
    }

  })
}
onPageChange(page: number) {
  this.page = page;
  this.loadAvis();
}
}
