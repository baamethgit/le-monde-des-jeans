import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static emailDomain(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const validDomains = [
        'gmail.com', 'yahoo.com', 'yahoo.fr', 'hotmail.com', 
        'hotmail.fr', 'outlook.com', 'outlook.fr', 'live.com',
        'live.fr', 'orange.fr', 'wanadoo.fr', 'free.fr',
        'protonmail.com'
      ];

      const email = control.value?.toLowerCase();
      
      // Vérification du format de base
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        return { invalidEmail: true };
      }

      // Extraction du domaine
      const domain = email.split('@')[1];

      // Vérification du domaine
      if (!validDomains.includes(domain)) {
        return { invalidDomain: true };
      }

      return null;
    };
  }
}