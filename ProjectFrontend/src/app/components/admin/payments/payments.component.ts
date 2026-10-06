import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../../../services/payment.service';
import { Payment } from '../../../models/payment.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css'
})
export class PaymentsComponent implements OnInit {
  payments: Payment[] = [];
  isEdit = false;
  success = '';
  error = '';
  currentPayment: any = { maintenanceId: 1, transactionId: '', amount: 2500, paymentMode: 'UPI', paymentDate: new Date().toISOString().substring(0, 10), status: 'Successful' };

  constructor(private ps: PaymentService) {}

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    this.ps.getAllPayments().subscribe({
      next: (d) => this.payments = d,
      error: () => this.error = 'Failed to load payments.'
    });
  }

  savePayment(): void {
    if (!this.currentPayment.transactionId) {
      this.currentPayment.transactionId = 'TXN' + Math.floor(100000 + Math.random() * 900000);
    }
    this.ps.createPayment(this.currentPayment).subscribe({
      next: () => {
        this.success = 'Payment record saved successfully!';
        this.resetForm();
        this.loadPayments();
      },
      error: () => this.error = 'Failed to save payment.'
    });
  }

  editPayment(p: Payment): void {
    this.isEdit = true;
    this.success = '';
    this.error = '';
    this.currentPayment = { ...p, maintenanceId: p.maintenance ? p.maintenance.id : p.maintenanceId };
  }

  updatePayment(): void {
    this.savePayment();
  }

  deletePayment(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this payment record?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      confirmButtonColor: '#dc3545'
    }).then((res) => {
      if (res.isConfirmed) {
        this.ps.deletePayment(id).subscribe({
          next: () => {
            this.success = 'Payment record deleted!';
            this.loadPayments();
          },
          error: () => this.error = 'Failed to delete payment.'
        });
      }
    });
  }

  resetForm(): void {
    this.isEdit = false;
    this.currentPayment = { maintenanceId: 1, transactionId: '', amount: 2500, paymentMode: 'UPI', paymentDate: new Date().toISOString().substring(0, 10), status: 'Successful' };
    this.error = '';
  }
}
