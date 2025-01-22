import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Infos } from '../models/infos.module';
import { Observable } from 'rxjs';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class InfosService {

  private baseUrl = environment.apiUrl;
  private apiUrl = `${this.baseUrl}/user/InfosGen/`;

  constructor(private http: HttpClient) { }

  getInfos(): Observable<Infos> {
    return this.http.get<Infos>(this.apiUrl);
  }

  updateInfos(infos: Infos): Observable<Infos> {
    return this.http.put<Infos>(`${this.apiUrl}update`, infos);
  }
}
