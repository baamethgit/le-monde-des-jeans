import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { ZoneLivraison } from '../../../models/zone-livraison';
import { CommandeService } from '../../../services/commandes/commande.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateZoneComponent } from '../create-zone/create-zone.component';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-liste-zones',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './liste-zones.component.html',
  styleUrl: './liste-zones.component.scss'
})
export class ListeZonesComponent implements OnInit{
  zones: ZoneLivraison[] = [];
  commandeService = inject(CommandeService);
  alertMessage = "";
  isLoading : boolean = true;

  constructor(){}
  ngOnInit(): void {
      this.loadZones();
  }

  loadZones(){
  this.commandeService.getDeliveryZones().pipe(
    finalize(()=>{
      this.isLoading = false;
    })
  ).subscribe({
    next:(data)=>{
      this.zones = data;
    },
    error:(error)=>{

    }
  })
  }

  deleteZone(idZone : number){
      this.commandeService.deleteZone(idZone).subscribe({
        next:(value) =>{
            this.alertMessage = 'La zone est supprimé';
            this.loadZones();
        },
        error : (err) => {
            
        },
      })
  }
  
}
