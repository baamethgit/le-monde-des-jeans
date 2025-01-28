import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InfosService } from '../../../services/infos.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-infos-gen',
  standalone: true,
  imports: [CommonModule,FormsModule, ReactiveFormsModule],
  templateUrl: './infos-gen.component.html',
  styleUrl: './infos-gen.component.scss'
})
export class InfosGenComponent {
  infoForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly infosService: InfosService
  ) {
    this.infoForm = this.fb.group({
      addresse_mail_site: ['', [Validators.required, Validators.email]],
      telephone_site: ['', Validators.required],
      addresse_site: ['', Validators.required],
      Lien_facebook: ['', [Validators.pattern('https?://(www\\.)?facebook\\.com/.*')]],
      Lien_instagram: ['', [Validators.pattern('https?://(www\\.)?instagram\\.com/.*')]],
      Lien_Whatsapp: ['', [Validators.pattern('https?://(chat\\.)?whatsapp\\.com/.*')]]
    });
  }

  ngOnInit() {
    this.loadCurrentInfo();
  }

  loadCurrentInfo() {
    this.infosService.getInfos().subscribe({
      next: (data) => {
        this.infoForm.patchValue(data);
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des informations.';
      }
    });
  }

  resetForm() {
    this.loadCurrentInfo();
  }
  onSubmit() {
    if (this.infoForm.valid) {
      const updatedInfo = this.infoForm.value;
      
      this.infosService.updateInfos(updatedInfo).subscribe({
        next: (response) => {
          this.successMessage = 'Informations mises à jour avec succès !';
          setTimeout(() => this.successMessage = '', 3000); // Message disparaît après 3 secondes
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la mise à jour des informations.';
        }
      });
    }
  }
}
