import { Component, inject, OnInit } from '@angular/core';
import { CommandeService } from '../../../services/commandes/commande.service';
import { ZoneLivraison } from '../../../models/zone-livraison';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-zone',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './create-zone.component.html',
  styleUrl: './create-zone.component.scss'
})
export class CreateZoneComponent implements OnInit{
  commandeService = inject(CommandeService);
  alertMessage : string = '';
  zoneCreationForm! : FormGroup;
  fb = inject(FormBuilder);
  router = inject(Router);

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
      this.createZone(zone);
      this.router.navigate(['/mdj_admin/zones-livraison']);
    }else{
      this.zoneCreationForm.markAllAsTouched();
    }

  }

  createZone(newZone : ZoneLivraison){
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
    history.back();
  }
}
