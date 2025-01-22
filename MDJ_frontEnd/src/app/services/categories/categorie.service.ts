import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { categorie } from '../../models/categorie';
import {environment} from "../../../environments/environment";





@Injectable({
  providedIn: 'root'
})
export class CategorieService {
  private apiUrl=`${environment.apiUrl}/apiProduit/categories/`;

  constructor(private http:HttpClient) { }


  getAllCategories():Observable<categorie[]>{
    return this.http.get<categorie[]>(`${this.apiUrl}`)
  }

  createCategory(data:FormData):Observable<categorie>{
    return this.http.post<categorie>(this.apiUrl,data)
  }

  deleteCategory(id:number):Observable<any>{
    return this.http.delete<categorie>(`${this.apiUrl}${id}/`)
  }
  updateCategory(id:number, data:FormData):Observable<categorie>{
    return this.http.put<categorie>(`${this.apiUrl}${id}/`, data)
  }

}
