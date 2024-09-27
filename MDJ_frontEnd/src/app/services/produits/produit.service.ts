import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { categorie } from '../categories/categorie.service';


export interface ProduitImage {
  image: string;
}

export interface Produit {
  id: number;
  nom: string;
  prix: number;
  categorie: categorie;
  taille?: string;
  composition?: string;
  couleur?: string;
  slug: string;
  QuantiteStock: number;
  reserve: boolean;
  special: boolean;
  images: ProduitImage[];  // Change this to array of objects with 'image' property
}

@Injectable({
  providedIn: 'root'
})
export class ProduitService {
  private apiUrl="http://127.0.0.1:8000/apiProduit/products/"

  constructor(private http:HttpClient) { }

  getProducts():Observable<Produit[]>{
    return this.http.get<Produit[]>(this.apiUrl)
  }

  getProductBySlug(slug:string): Observable<Produit> {
    const url = `${this.apiUrl}${slug}/`; 
    return this.http.get<Produit>(url);
  }

  getProductByCategory(categorie:string):Observable<Produit[]>{
    return this.http.get<Produit[]>(`${this.apiUrl}?categorie=${categorie}`)
  }
}
