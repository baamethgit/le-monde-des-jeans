import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-paiement-success',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './paiement-success.component.html',
  styleUrl: './paiement-success.component.scss'
})
export class PaiementSuccessComponent {
ngOnInit(): void {
  //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
  //Add 'implements OnInit' to the class.
  // verifierStatut(){

  // }
}
}
