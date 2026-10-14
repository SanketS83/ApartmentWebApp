import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentService } from '../../../services/payment.service';
import { Payment } from '../../../models/payment.model';

@Component({
  selector: 'app-res-pay-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css'
})
export class PaymentsComponent implements OnInit {
  payments: Payment[] = [];
  currentUser: any = null;

  constructor(private ps: PaymentService) {}

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.loadPayments();
  }

  loadPayments(): void {
    if (this.currentUser && this.currentUser.id) {
      this.ps.getPaymentsByResident(this.currentUser.id).subscribe({
        next: (d) => this.payments = d,
        error: () => {}
      });
    }
  }
}