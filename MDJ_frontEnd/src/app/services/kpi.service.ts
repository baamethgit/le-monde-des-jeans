import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KpiService {

 private apiUrl = '/api/apiProduit';

  constructor(private http: HttpClient) { }

  getDashboardKpi(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/kpi/`,{withCredentials: true  });
  }

}
