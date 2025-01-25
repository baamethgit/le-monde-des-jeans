import {HttpClient, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PaiementService {

  private baseUrl = environment.apiUrl;
  private apiUrl = `${this.baseUrl}/paiement`;

    constructor(private http: HttpClient) { }


  initiateWavePayment(orderId: number) : Observable<any>{
    return this.http.post(`${this.apiUrl}/api/wave/initiate/`, { order_id: orderId },{withCredentials:true});
  }

  verifyPaymentStatus(refCode: string) {
    return this.http.get(`${this.apiUrl}/api/wave/check_status/${refCode}`, { withCredentials:true });
  }

  getPayments(filters: { selectedMethod?: string, startDate?: string, endDate?: string, minAmount?: number }): Observable<any[]> {
    let params = new HttpParams();

    if (filters.selectedMethod) {
      params = params.set('methode_paiement', filters.selectedMethod);
    }
    if (filters.startDate) {
      params = params.set('start_date', filters.startDate);
    }
    if (filters.endDate) {
      params = params.set('end_date', filters.endDate);
    }
    if (filters.minAmount) {
      params = params.set('min_amount', filters.minAmount.toString());
    }

    return this.http.get<any[]>(`${this.apiUrl}/api/wave/kpi/`, { params ,withCredentials:true});
  }

  getPaymentSummary(filters: { selectedMethod?: string, startDate?: string, endDate?: string, minAmount?: number }): Observable<any[]> {
    let params = new HttpParams();

    if (filters.selectedMethod) {
      params = params.set('methode_paiement', filters.selectedMethod);
    }
    if (filters.startDate) {
      params = params.set('start_date', filters.startDate);
    }
    if (filters.endDate) {
      params = params.set('end_date', filters.endDate);
    }
    if (filters.minAmount) {
      params = params.set('min_amount', filters.minAmount.toString());
    }

    return this.http.get<any[]>(`${this.apiUrl}/api/wave/payment_summary/`, { params ,withCredentials:true});
  }
}
