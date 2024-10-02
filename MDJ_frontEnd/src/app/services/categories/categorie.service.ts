import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { categorie } from '../../models/categorie';





@Injectable({
  providedIn: 'root'
})
export class CategorieService {
  private apiUrl="http://127.0.0.1:8000/apiProduit/categories/"
  constructor(private http:HttpClient) { }


  getAllCategories():Observable<categorie[]>{
    return this.http.get<categorie[]>(`${this.apiUrl}`)
  }

}
