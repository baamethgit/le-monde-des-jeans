import { inject, Injectable } from '@angular/core';
import { ZoneLivraison } from '../models/zone-livraison';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {
  private http = inject(HttpClient);
  private baseUrl = 'http://127.0.0.1:8000/';

  constructor() { }

  getDeliveryZones():Observable<ZoneLivraison[]>{
    const url = `${this.baseUrl}shop/zones/`;
    return this.http.get<ZoneLivraison[]>(url); 
  }
}
