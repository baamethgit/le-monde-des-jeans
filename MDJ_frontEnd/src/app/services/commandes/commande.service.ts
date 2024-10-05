import { inject, Injectable } from '@angular/core';
import { ZoneLivraison } from '../../models/zone-livraison';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Commande } from '../../models/commande';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {
  private http = inject(HttpClient);
  private baseUrl = 'http://127.0.0.1:8000/';

  constructor() { }

  getDeliveryZones():Observable<ZoneLivraison[]>{
    const url = `${this.baseUrl}apiProduit/zones/`;
    return this.http.get<ZoneLivraison[]>(url); 
  }

  getDeliveryZoneByNumber(num:number):Observable<ZoneLivraison>{
    const url = `${this.baseUrl}apiProduit/zone/${num}/`;
    return this.http.get<ZoneLivraison>(url); 
  }


  getCommandes(page: number = 1, pageSize: number = 10, searchTerm: string = '',dateFilter : Date): Observable<Commande[]> {
        let params = new HttpParams()
          .set('page', page.toString())
          .set('page_size', pageSize.toString())
          .set('date_filtre', dateFilter.toString());
        
        if (searchTerm) {
          params = params.set('search', searchTerm);
        }

        return this.http.get<Commande[]>(`${this.baseUrl}commandes/`, { params });
  }

  creerCommande(fromPanier: boolean = false, produitSlug?: string): Observable<any> {
    const data: any = {};
    if (fromPanier) {
      data.from_panier = true;
    } else if (produitSlug) {
      data.produit_slug = produitSlug;
    }
    return this.http.post(`${this.baseUrl}apiProduit/creer-commande/`, data,{withCredentials: true  });
  }

  getDetailCommande(commandeId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}apiProduit/detail-commande/${commandeId}/`,{withCredentials: true  });
  }

  getCurrentCommande(): Observable<any> {
    return this.http.get(`${this.baseUrl}apiProduit/commandes-en-attente/`,{withCredentials: true  });
  }

  getListeCommandes(): Observable<any> {
    return this.http.get(`${this.baseUrl}apiProduit/commandes-client/`,{withCredentials: true  });
  }

  validerCommande(commandeId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}apiProduit/commandes/${commandeId}/valider/`, {},{withCredentials: true  });
  }

  annulerCommande(commandeId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}apiProduit/commandes/${commandeId}/annuler/`, {},{withCredentials: true  });
  }

  supprimerCommande(commandeId: number): Observable<any> {
      return this.http.delete(`${this.baseUrl}apiProduit/commandes/${commandeId}/delete/`,{withCredentials: true  });
  }
}