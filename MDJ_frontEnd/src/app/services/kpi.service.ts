import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class KpiService {

  private baseUrl = environment.apiUrl;
  private apiUrl = `${this.baseUrl}/apiProduit`;

  constructor(private http: HttpClient) { }

  getDashboardKpi(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/kpi/`,{withCredentials: true  });
  }

}
