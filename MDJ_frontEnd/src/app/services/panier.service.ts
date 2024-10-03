import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PanierService {
  private apiUrl = 'http://127.0.0.1:8000/apiProduit';

  constructor(private http: HttpClient) { }

  getPanier(): Observable<any> {
    return this.http.get(`${this.apiUrl}/panier/`,{withCredentials: true  });
  }

  createPanier(): Observable<any> {
    return this.http.post(`${this.apiUrl}/panier/`, {},{withCredentials: true  });
  }

  ajouterProduit(produitId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/panier/ajouter/`, { produit_id: produitId },{withCredentials: true  });
  }

  retirerProduit(produitId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/panier/retirer/`, { produit_id: produitId },{withCredentials: true  });
  }

  getContenuPanier(): Observable<any> {
    return this.http.get(`${this.apiUrl}/panier/contenu/`,{withCredentials: true  });
  }

  viderPanier(): Observable<any> {
    return this.http.post(`${this.apiUrl}/panier/vider/`, {},{withCredentials: true  });
  }
}