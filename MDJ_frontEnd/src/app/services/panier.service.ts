import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ipanier } from '../components/user/panier/panier.model';

@Injectable({
  providedIn: 'root'
})
export class PanierService {
  private apiUrl = 'http://127.0.0.1:8000/apiProduit';

  constructor(private http: HttpClient) { }

  getPanier(): Observable<Omit<Ipanier,'produits'>> { // gére aussi la création.
    return this.http.get<Omit<Ipanier,'produits'>>(`${this.apiUrl}/panier/`,{withCredentials: true  });
  }

  getContenPanier(): Observable<any> { // gére aussi la création.
    return this.http.get(`${this.apiUrl}/panier/conten/`,{withCredentials: true  });
  }



  ajouterProduit(produitSlug: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/panier/ajouter/`, { produit_slug: produitSlug },{withCredentials: true  });
  }

  retirerProduit(produitSlug: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/panier/retirer/`, { produit_slug: produitSlug },{withCredentials: true  });
  }

  getContenuPanier(): Observable<any> {
    return this.http.get(`${this.apiUrl}/panier/contenu/`,{withCredentials: true  });
  }

  viderPanier(): Observable<any> {
    return this.http.post(`${this.apiUrl}/panier/vider/`, {},{withCredentials: true  });
  }
}