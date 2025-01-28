import { Component, inject, OnInit } from '@angular/core';
import { CommandeService } from '../../../services/commandes/commande.service';
import { ZoneLivraison } from '../../../models/zone-livraison';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-zone',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './update-zone.component.html',
  styleUrl: './update-zone.component.scss'
})
export class UpdateZoneComponent implements OnInit{
zone! : ZoneLivraison;
commandeService = inject(CommandeService);
alertMessage : string = '';
zoneUpdateForm! : FormGroup;
fb = inject(FormBuilder);

constructor(private readonly route: ActivatedRoute, private readonly router : Router){}

ngOnInit(): void {
   this.zoneUpdateForm = this.fb.group({
        numero: ['', [Validators.required]],
        nom: ['', [Validators.required]],
        prix_livraison: ['', [Validators.required]],
        info: ['', [Validators.maxLength(2500)]],
    });
    this.initializeForm();
}

onSubmit(){
  if (this.zoneUpdateForm.valid){
    const zone = {
      id : this.zone.id,
      numero : this.zoneUpdateForm.getRawValue().numero,
      nom : this.zoneUpdateForm.getRawValue().nom,
      prix_livraison : this.zoneUpdateForm.getRawValue().prix_livraison,
      info : this.zoneUpdateForm.getRawValue().info
    } as ZoneLivraison;

    this.updateZone(zone);
  }else{
    this.zoneUpdateForm.markAllAsTouched();
  }

}

updateZone(newZone : ZoneLivraison){
  this.commandeService.updateZone(newZone,newZone.id).subscribe({
    next:(response)=>{
        this.alertMessage = "La zone est mis à jour";
        this.router.navigate(['/mdj_admin/zones-livraison']);
    }
  })
}

  resetForm(){
    history.back();
  }

  initializeForm(){
    const idZone=this.route.snapshot.params['id'];
    this.commandeService.getDeliveryZoneByNumber(idZone).subscribe({
      next:(response)=>{
        this.zone = response;
        this.zoneUpdateForm.patchValue(this.zone);
    }
    })
  }
}
