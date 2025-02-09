import { Component, inject, OnInit } from '@angular/core';
import { Commande } from '../../../models/commande';
import { CommandeService } from '../../../services/commandes/commande.service';
import { StatutCommande } from '../../../models/StatutCommande';
import { ActivatedRoute, Router } from '@angular/router';
import html2canvas from 'html2canvas';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {ImageViewerComponent} from "../../image-viewer/image-viewer.component";

@Component({
  selector: 'app-admin-detail-commande',
  standalone: true,
  imports: [CommonModule,FormsModule,ImageViewerComponent],
  templateUrl: './admin-detail-commande.component.html',
  styleUrl: './admin-detail-commande.component.scss'
})
export class AdminDetailCommandeComponent implements OnInit {
  textStatut : string = '';
  commande! : Commande;
  notCommandFound : boolean = false;
  commandeService = inject(CommandeService);
  protected readonly StatutCommande = StatutCommande;


  constructor(private readonly router:Router,private readonly route : ActivatedRoute){}

  ngOnInit(): void {
      // this.route.paramMap
      //   .pipe(map(params => params.get('id')), tap(id => (this.id = +id)))
      //   .subscribe(id => {});
      this.loadCommande();
  }
  loadCommande():void{
    const refCode = this.route.snapshot.params['ref-code'];
    this.commandeService.getCommandeByRefCode(refCode).subscribe(
      {
        next:(value)=> {
          this.commande = value;
          console.log(this.commande);
        },
        error:(error)=> {
          this.notCommandFound = true;
        },
      }
    )
  }
  downloadOrderDetails() {
    const element = document.getElementById('order-details-box');

    html2canvas(element as HTMLElement).then((canvas) => {
      const imageData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imageData;
      link.download = 'order-details.png';
      link.click();
    });
  }


  changeStatut(statut: StatutCommande){
      this.commandeService.updateCommandeStatus(this.commande.id,{'statut':statut.toString()}).subscribe({
        next:(data)=>{
            this.loadCommande();
        },
        error:(error)=>{

        }
      })
  }

  supprimerCommande(){
    this.commandeService.supprimerCommandeParAdmin(this.commande.id).subscribe({
      next:(data)=>{
        this.router.navigate(['/mdj_admin/commandes/'])
      },
      error:(error)=>{

      }
    })
}
}
