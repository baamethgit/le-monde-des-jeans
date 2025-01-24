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

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private paiementService = inject(PaiementService);

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
