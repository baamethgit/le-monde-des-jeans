import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {PaiementService} from "../../services/paiement.service";

@Component({
  selector: 'app-paiement-success',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './paiement-success.component.html',
  styleUrl: './paiement-success.component.scss'
})
export class PaiementSuccessComponent implements OnInit{

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly paiementService = inject(PaiementService);

  ngOnInit(): void {
    const refCode = this.route.snapshot.params['ref-code'];
    if(!refCode){
      this.router.navigate(['**']);
    }else {
      this.paiementService.verifyPaymentStatus(refCode).subscribe({
        next: (data) => {

        },
        error:(error)=>{
          this.router.navigate(['payment-error',refCode]);
        }})
    }
  }
}
