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
}