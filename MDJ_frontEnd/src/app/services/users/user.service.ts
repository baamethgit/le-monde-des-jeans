import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../models/user';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  listUsers : User[] = [
    { id: 1, nom_complet: 'Jean Dupont', phone_number: '01 23 45 67 89' },
    { id: 2, nom_complet: 'Marie Martin', phone_number: '02 34 56 78 90' },
    { id: 3, nom_complet: 'Pierre Durand', phone_number: '03 45 67 89 01' },
    { id: 4, nom_complet: 'Sophie Lefebvre', phone_number: '04 56 78 90 12' },
    { id: 5, nom_complet: 'Luc Moreau', phone_number: '05 67 89 01 23' },
    { id: 6, nom_complet: 'Élodie Rousseau', phone_number: '06 78 90 12 34' },
    { id: 7, nom_complet: 'Thomas Bernard', phone_number: '07 89 01 23 45' },
    { id: 8, nom_complet: 'Camille Petit', phone_number: '08 90 12 34 56' },
    { id: 9, nom_complet: 'Antoine Girard', phone_number: '09 01 23 45 67' },
    { id: 10, nom_complet: 'Chloé Lambert', phone_number: '01 12 23 34 45' }
  ];

  private baseUrl = 'http://127.0.0.1:8000/';

  constructor(private http:HttpClient) { }

  getUsers(): Observable<User[]> {
    const url = `${this.baseUrl}user/admin_users_list`;
    return this.http.get<User[]>(url);
  }

  getUser(phone_number:string):Observable<User>{
    const url = `${this.baseUrl}user/client/${phone_number}/`;
    return this.http.get<User>(url);
  }
  deleteUser(phone_number:string):Observable<User>{
    const url = `${this.baseUrl}user/client/${phone_number}/`;
    return this.http.delete<User>(url);
  }
}
