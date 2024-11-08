import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { ZoneLivraison } from '../../../models/zone-livraison';
import { CommandeService } from '../../../services/commandes/commande.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateZoneComponent } from '../create-zone/create-zone.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-liste-zones',
  standalone: true,
  imports: [CommonModule,CreateZoneComponent,RouterLink],
  templateUrl: './liste-zones.component.html',
  styleUrl: './liste-zones.component.scss'
})
export class ListeZonesComponent implements OnInit{
  zones: ZoneLivraison[] = [];
  commandeService = inject(CommandeService);
  open = false;
  action : 'add' | 'update' = 'add';
  alertMessage = "";
  private modalService = inject(NgbModal);
  constructor(){}
  ngOnInit(): void {
      this.loadZones();
  }

  loadZones(){
  this.commandeService.getDeliveryZones().subscribe({
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
