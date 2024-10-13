import { inject, Injectable } from '@angular/core';
import { ZoneLivraison } from '../../models/zone-livraison';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Commande } from '../../models/commande';
import { StatutCommande } from '../../models/StatutCommande';

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

  createZone(newZone : ZoneLivraison):Observable<any>{
    const url = `${this.baseUrl}apiProduit/creer-zone/`;
    return this.http.post<ZoneLivraison>(url,newZone, { withCredentials: true });
  }

  updateZone(newZone : ZoneLivraison, idZone : number):Observable<any>{
    const url = `${this.baseUrl}apiProduit/zone/${idZone}/update/`;
    return this.http.put<any>(url,newZone, { withCredentials: true });
  }

  deleteZone(idZone : number):Observable<any>{
    const url = `${this.baseUrl}apiProduit/zone/${idZone}/delete/`;
    return this.http.delete<any>(url, { withCredentials: true });
  }

  getCommandes(page: number = 1, pageSize: number = 10, searchTerm: string = ''): Observable<any> {
        let params = new HttpParams()
          .set('page', page.toString())
          .set('page_size', pageSize.toString());
        
        if (searchTerm) {
          params = params.set('search', searchTerm);
        }
        // if (dateFilter) {
        //   params = params.set('date_filtre', dateFilter.toString());
        // }

        // if (statut) {
        //   params = params.set('statut', statut);
        // }

        return this.http.get(`${this.baseUrl}apiProduit/list-commandes/`, { params });
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

  getCommandeByRefCode(commandeRefCode: number): Observable<any> {
    return this.http.get(`${this.baseUrl}apiProduit/detail-commande-ref/${commandeRefCode}/`,{withCredentials: true  });
  }


  getCurrentCommande(): Observable<any> {
    return this.http.get(`${this.baseUrl}apiProduit/commandes-en-attente/`,{withCredentials: true  });
  }

  getListeCommandes(): Observable<any> {
    return this.http.post(`${this.baseUrl}apiProduit/commandes-client/`,{withCredentials: true  });
  }

  getListeCommandesEnCours(): Observable<any> {
    return this.http.get(`${this.baseUrl}apiProduit/commandes-en-cours/`,{withCredentials: true });
  }

  getListeCommandesHistorique(): Observable<any> {
    return this.http.get(`${this.baseUrl}apiProduit/historique-commandes/`,{withCredentials: true });
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

  getCommandesByStatus(commandeStatus: string): Observable<any> {
    return this.http.post(`${this.baseUrl}apiProduit/commandes/${commandeStatus}/filtrer/`, {},{withCredentials: true  });
  }

  updateCommande(id: number, newData: any){
    return this.http.patch(`${this.baseUrl}apiProduit/commandes/${id}/update/`, newData,{withCredentials: true  });
  }

  
  getStatsCommande():Observable<any>{
    const url=`${this.baseUrl}apiProduit/stats-commandes/`
    return this.http.get(url,{ withCredentials: true })
  }

  getHistoriquesCommande():Observable<any>{
    const url=`${this.baseUrl}apiProduit/historique-commandes/`
    return this.http.get(url,{ withCredentials: true })
  }

}