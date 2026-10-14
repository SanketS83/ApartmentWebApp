import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Payment } from '../models/payment.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private endpoint = 'payments';

  constructor(private api: ApiService) {}

  getAllPayments(): Observable<Payment[]> {
    return this.api.get<Payment[]>(this.endpoint);
  }

  getPaymentById(id: number): Observable<Payment> {
    return this.api.get<Payment>(this.endpoint + '/' + id);
  }

  getPaymentsByResident(residentId: number): Observable<Payment[]> {
    return this.api.get<Payment[]>(this.endpoint + '/resident/' + residentId);
  }

  createPayment(data: any): Observable<Payment> {
    return this.api.post<Payment>(this.endpoint, data);
  }

  updatePayment(id: number, data: any): Observable<Payment> {
    return this.api.put<Payment>(this.endpoint + '/' + id, data);
  }

  deletePayment(id: number): Observable<void> {
    return this.api.delete<void>(this.endpoint + '/' + id);
  }

  // --- Stripe Gateway ---
  createStripeSession(maintenanceId: number): Observable<{ url: string; sessionId: string }> {
    return this.api.post<{ url: string; sessionId: string }>(`${this.endpoint}/stripe/create-session/${maintenanceId}`, {});
  }

  confirmPayment(sessionId: string): Observable<any> {
    return this.api.post<any>(`${this.endpoint}/stripe/confirm?sessionId=${encodeURIComponent(sessionId)}`, {});
  }

  // --- Cash Payment Workflow ---
  recordCashPayment(data: { maintenanceId: number; residentId?: number; remarks?: string }): Observable<Payment> {
    return this.api.post<Payment>(`${this.endpoint}/cash/record`, data);
  }

  approveCashPayment(paymentId: number): Observable<Payment> {
    return this.api.post<Payment>(`${this.endpoint}/${paymentId}/approve-cash`, {});
  }

  rejectCashPayment(paymentId: number, reason?: string): Observable<Payment> {
    const url = reason 
      ? `${this.endpoint}/${paymentId}/reject-cash?reason=${encodeURIComponent(reason)}` 
      : `${this.endpoint}/${paymentId}/reject-cash`;
    return this.api.post<Payment>(url, {});
  }

  approveMaintenanceCash(maintenanceId: number): Observable<Payment> {
    return this.api.post<Payment>(`${this.endpoint}/maintenance/${maintenanceId}/approve-cash`, {});
  }
}