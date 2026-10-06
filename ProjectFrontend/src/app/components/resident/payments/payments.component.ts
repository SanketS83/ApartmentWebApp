import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentService } from '../../../services/payment.service';
import { Payment } from '../../../models/payment.model';
@Component({ selector: 'app-res-pay-page', standalone: true, imports: [CommonModule], templateUrl: './payments.component.html', styleUrl: './payments.component.css' })
export class PaymentsComponent implements OnInit {
  payments: Payment[] = [];
  constructor(private ps: PaymentService) {}
  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (user.id) this.ps.getPaymentsByResident(user.id).subscribe(d => this.payments = d);
  }
}