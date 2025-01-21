import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommandeService } from '../../../services/commandes/commande.service';
import { Commande } from '../../../models/commande';
import { StatutCommande } from '../../../models/StatutCommande';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-mes-commandes',
  standalone: true,
  imports: [CommonModule,DatePipe,ReactiveFormsModule,FormsModule,RouterLink],
  templateUrl: './mes-commandes.component.html',
  styleUrl: './mes-commandes.component.scss'
})
export class MesCommandesComponent implements OnInit {
  commandeService = inject(CommandeService);
  mesCommandesEnCours : Commande[] = [];
  mesCommandesLivrees : Commande[] = [];
  activeTab: 'pending' | 'completed' = 'pending';
  StatutCommande = StatutCommande;
  modalService = inject(NgbModal);
  formBuilder = inject(FormBuilder);
  TemoignageForm! : FormGroup;
  @ViewChild('temoignage') temoignageModal: any;

  constructor() {}

  ngOnInit(): void {
    this.loadData();
    this.TemoignageForm = this.formBuilder.group(
      {
        Texte_avis: ['', [Validators.required]],
        nbre_etoiles: [4, [Validators.required]],
      }
    );
  }

  loadData(){
    this.commandeService.getListeCommandesEnCours().subscribe({
      next : (data) => {
        this.mesCommandesEnCours = data;
      },
      error : (error) =>{

      },
    })
    this.commandeService.getListeCommandesHistorique().subscribe({
      next : (value) => {
          this.mesCommandesLivrees = value;
      },
      error : (err) =>{

      },
    })
  }

  MarquerColisRecu(id_commande:number, event: Event):void{
    const checkbox = event.target as HTMLInputElement;
    const isChecked = checkbox.checked;
    if (isChecked) {
      const confirmed = confirm("Vous-étes sur d'avoir reçu le colis?");
      if (confirmed) {
    this.commandeService.updateCommandeStatus(id_commande,{'statut':'LIVREE'}).subscribe({
      next:(data)=>{
        this.loadData();
        this.openModal();
      },
      error:(error)=>{

      }
    })
    }else{
        checkbox.checked = false;
      }
    }
  }

  temoigner():void{
    if(this.TemoignageForm.valid){
      const data = this.TemoignageForm.getRawValue();
      this.commandeService.CreateTemoignage(data).subscribe(
        (response)=> {
          alert("merci pour cet avis");
          this.closeModal();
        }
      )
    }else{
        this.TemoignageForm.markAllAsTouched();
      }
  }

  openModal(){
    this.modalService.open(this.temoignageModal);
  }

  closeModal(){
    this.modalService.dismissAll();
  }

}
