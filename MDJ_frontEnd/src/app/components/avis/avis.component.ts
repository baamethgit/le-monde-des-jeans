import { Component } from '@angular/core';
import { UserService } from '../../services/users/user.service';
import { Avis } from '../../models/Avis';

@Component({
  selector: 'app-avis',
  standalone: true,
  imports: [],
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
    },
    error: (error) => {
      console.log('Erreur lors de l affichage des avis :', error.error.detail);
}

  })
}
}
