import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Infos } from '../models/infos.module';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InfosService {

  private apiUrl = 'http://127.0.0.1:8000/user/InfosGen/';

  constructor(private http: HttpClient) { }

  getInfos(): Observable<Infos> {
    return this.http.get<Infos>(this.apiUrl);
  }

  updateInfos(infos: Infos): Observable<Infos> {
    return this.http.put<Infos>(`${this.apiUrl}update`, infos);
  }
}
