import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {PaiementService} from "../../services/paiement.service";
import {Commande} from "../../models/commande";

@Component({
  selector: 'app-paiement-failed',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './paiement-failed.component.html',
  styleUrl: './paiement-failed.component.scss'
})
export class PaiementFailedComponent implements OnInit{
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private paiementService = inject(PaiementService);
  commande : Commande | undefined;

  ngOnInit() {
    const refCode = this.route.snapshot.params['ref-code'];
    if(!refCode){
      this.router.navigate(['**']);
    }else {
      this.paiementService.verifyPaymentStatus(refCode).subscribe({
        next: (data) => {
          this.commande = data['commande'];
          if(data['status']=='error' || data['status']=='failed'){
          }else if (data['status']=='succeeded'){
            this.router.navigate(['payment-success',refCode]);
          }
          else {
            this.router.navigate(["**"]);
          }
        },
        error:(error)=>{
          this.router.navigate(['**']);
        }})
    }
  }
}
