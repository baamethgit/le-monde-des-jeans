import { Component } from '@angular/core';
import { UserService } from '../../services/users/user.service';
import { Avis } from '../../models/Avis';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-avis',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './avis.component.html',
  styleUrl: './avis.component.scss'
})
export class AvisComponent {
Avis:Avis[]=[];

  constructor(private readonly userService:UserService){}

ngOnInit():void{
  this.userService.getAllAvis().subscribe({
    next:(data:Avis[])=>{
      this.Avis=data
    }

  })
}
}
