import { inject, Injectable } from '@angular/core';
import { ZoneLivraison } from '../../models/zone-livraison';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Panier } from '../../models/panier';
import { Produit } from '../../models/produit';
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

  getUserCart() : Observable<Panier> {
    return this.http.get<Panier>(`${this.baseUrl}cart/`, { withCredentials: true  });
  }

  addOrderToCart(product_slug:string,quantite?:number):Observable<any>{
    return this.http.post<any>(`${this.baseUrl}cart/`,{product_slug:product_slug,quantite:quantite} ,{ withCredentials: true });
  }

  addProductToCart(){

  }

  removeProduct(){

  }

  creerCommande(produits : Produit[]){
    
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


}
