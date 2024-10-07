import { Component, inject, OnInit } from '@angular/core';
import { CommandeService } from '../../../services/commandes/commande.service';
import { ZoneLivraison } from '../../../models/zone-livraison';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-zone',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './create-zone.component.html',
  styleUrl: './create-zone.component.scss'
})
export class CreateZoneComponent implements OnInit{
  // zone : ZoneLivraison;
  commandeService = inject(CommandeService);
  alertMessage : string = '';
  zoneCreationForm! : FormGroup;
  fb = inject(FormBuilder);

  ngOnInit(): void {
     this.zoneCreationForm = this.fb.group({
          numero: ['', [Validators.required]],
          nom: ['', [Validators.required]],
          prix_livraison: ['', [Validators.required]],
          info: ['', [Validators.maxLength(2500)]],
      })
  }

  onSubmit(){
    if (this.zoneCreationForm.valid){
      const zone = {
        numero : this.zoneCreationForm.getRawValue().numero,
        nom : this.zoneCreationForm.getRawValue().nom,
        prix_livraison : this.zoneCreationForm.getRawValue().prix_livraison,
        info : this.zoneCreationForm.getRawValue().info
      } as ZoneLivraison;
      this.creatZone(zone);
    }else{
      this.zoneCreationForm.markAllAsTouched();
    }

  }
  creatZone(newZone : ZoneLivraison){
    this.commandeService.createZone(newZone).subscribe({
      next:(response)=>{
          this.alertMessage = "Une nouvelle Zone a été créée";
      },
      error : (error) => {
          console.log(error.error);
      },
    })
  }

  resetForm(){
    this.zoneCreationForm.reset();
  }
}
