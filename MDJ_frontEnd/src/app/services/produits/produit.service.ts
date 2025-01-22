import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Produit } from '../../models/produit';
import { User } from '../../models/user';


@Injectable({
  providedIn: 'root'
})
export class ProduitService {
  private apiUrl="http://127.0.0.1:8000/apiProduit/products/"

  constructor(private http:HttpClient) { }

  getProducts(page: number = 1, pageSize: number = 10):Observable<any>{
    let params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());
    return this.http.get<Produit[]>(this.apiUrl, { params })
  }


  getProductsAdmin(page: number = 1, pageSize: number = 10): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());

    return this.http.get<Produit[]>(`${this.apiUrl}`, { params });
  }



  getProductBySlug(slug:string): Observable<Produit> {
    const url = `${this.apiUrl}${slug}/`;
    return this.http.get<Produit>(url);
  }



  getProductByCategory(categorie:string, page: number = 1, pageSize: number = 10):Observable<any>{
    let params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());
    return this.http.get<Produit[]>(`${this.apiUrl}?categorie=${categorie}`,{ params })
  }

  getProductBySpecial(page: number = 1, pageSize: number = 10):Observable<any>{
    let params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());
    return this.http.get<Produit[]>(`${this.apiUrl}?special=True`,{ params })
  }

  CreateProduct(formData: FormData): Observable<any> {
    return this.http.post<Produit>(this.apiUrl, formData);
  }

  deleteProduct(id:number):Observable<any>{
    return this.http.delete<Produit>(`${this.apiUrl}${id}/`)
  }

  updateProduct(id:number, data:FormData):Observable<Produit>{
    return this.http.put<Produit>(`${this.apiUrl}${id}/`, data)
  }
}
