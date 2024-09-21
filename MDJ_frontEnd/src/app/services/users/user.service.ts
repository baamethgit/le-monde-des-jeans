import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  listUsers : User[] = [
    { id: 1, nom_complet: 'Jean Dupont', telephone: '01 23 45 67 89' },
    { id: 2, nom_complet: 'Marie Martin', telephone: '02 34 56 78 90' },
    { id: 3, nom_complet: 'Pierre Durand', telephone: '03 45 67 89 01' },
    { id: 4, nom_complet: 'Sophie Lefebvre', telephone: '04 56 78 90 12' },
    { id: 5, nom_complet: 'Luc Moreau', telephone: '05 67 89 01 23' },
    { id: 6, nom_complet: 'Élodie Rousseau', telephone: '06 78 90 12 34' },
    { id: 7, nom_complet: 'Thomas Bernard', telephone: '07 89 01 23 45' },
    { id: 8, nom_complet: 'Camille Petit', telephone: '08 90 12 34 56' },
    { id: 9, nom_complet: 'Antoine Girard', telephone: '09 01 23 45 67' },
    { id: 10, nom_complet: 'Chloé Lambert', telephone: '01 12 23 34 45' }
  ];
  constructor() { }

  getUsers():User[]{
    return this.listUsers;
  }
}
