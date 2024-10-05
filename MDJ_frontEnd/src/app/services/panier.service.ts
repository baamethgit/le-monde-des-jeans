import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IcontenuPanier, Ipanier } from '../components/user/panier/panier.model';
import dayjs from 'dayjs';
import * as duration from 'dayjs/plugin/duration';

@Injectable({
  providedIn: 'root'
})
export class PanierService {
  private apiUrl = 'http://127.0.0.1:8000/apiProduit';

  constructor(private http: HttpClient) { }

  getPanier(): Observable<Omit<Ipanier,'produits'>> { // gére aussi la création.
    return this.http.get<Omit<Ipanier,'produits'>>(`${this.apiUrl}/panier/`,{withCredentials: true  });
  }

  ajouterProduit(produitSlug: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/panier/ajouter/`, { produit_slug: produitSlug },{withCredentials: true  });
  }

  retirerProduit(produitSlug: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/panier/retirer/`, { produit_slug: produitSlug },{withCredentials: true  });
  }

  getContenuPanier(): Observable<IcontenuPanier[]> {
    return this.http.get<IcontenuPanier[]>(`${this.apiUrl}/panier/contenu/`,{withCredentials: true  });
  }

  viderPanier(): Observable<any> {
    return this.http.post(`${this.apiUrl}/panier/vider/`, {},{withCredentials: true  });
  }

  calculerTempsRestant(dateAjout: string): { minutes: number, seconds: number } {
    const dateAjoutParsed = dayjs(dateAjout);
    const dateExpiration = dateAjoutParsed.add(5, 'minute');
    const maintenant = dayjs();

    if (maintenant.isAfter(dateExpiration)) {
      return { minutes: 0, seconds: 0 };
    }

    const diffMs = dateExpiration.diff(maintenant);
    const diffDuration = dayjs.duration(diffMs);

    return {
      minutes: diffDuration.minutes(),
      seconds: diffDuration.seconds()
    };
  }
}