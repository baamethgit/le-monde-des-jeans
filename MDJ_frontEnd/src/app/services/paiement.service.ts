import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaiementService {

    private apiUrl = 'http://127.0.0.1:8000/paiement';
  
    constructor(private http: HttpClient) { }
  

  initiateWavePayment(orderId: number) {
    return this.http.post(`${this.apiUrl}/api/wave/initiate`, { order_id: orderId });
  }

  verifyPaymentStatus(sessionId: number) {
    return this.http.post(`${this.apiUrl}/api/wave/session`, { session_id: sessionId });
  }
  
}
