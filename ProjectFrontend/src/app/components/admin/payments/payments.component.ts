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
  originalPaymentStatus = '';
  currentPayment: any = { 
    maintenanceId: 1, 
    transactionId: '', 
    amount: 2500, 
    paymentMode: 'Cash', 
    paymentDate: new Date().toISOString().substring(0, 10), 
    status: 'SUCCESS' 
  };

  constructor(private ps: PaymentService) {}

  ngOnInit(): void {
    this.loadPayments();
  }

  isPaid(status: string | undefined): boolean {
    if (!status) return false;
    const s = status.trim().toUpperCase();
    return s === 'SUCCESS' || s === 'PAID' || s === 'SUCCESSFUL';
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
      error: (err) => this.error = err?.error?.message || 'Failed to save payment.'
    });
  }

  editPayment(p: Payment): void {
    this.isEdit = true;
    this.success = '';
    this.error = '';
    this.originalPaymentStatus = p.status || '';
    this.currentPayment = { 
      ...p, 
      maintenanceId: p.maintenance ? p.maintenance.id : p.maintenanceId,
      residentId: p.resident ? p.resident.id : p.residentId
    };
  }

  updatePayment(): void {
    if (!this.currentPayment.id) return;

    if (this.isPaid(this.originalPaymentStatus) && this.currentPayment.status !== this.originalPaymentStatus) {
      this.error = 'Admin cannot change the status of an already paid payment.';
      Swal.fire({
        icon: 'error',
        title: 'Status Locked',
        text: 'The status of an already paid payment cannot be changed.'
      });
      return;
    }

    this.ps.updatePayment(this.currentPayment.id, this.currentPayment).subscribe({
      next: () => {
        this.success = 'Payment record updated successfully!';
        this.resetForm();
        this.loadPayments();
      },
      error: (err) => this.error = err?.error?.message || 'Failed to update payment.'
    });
  }

  deletePayment(id: number, status?: string): void {
    if (this.isPaid(status)) {
      Swal.fire({
        icon: 'error',
        title: 'Action Prohibited',
        text: 'Paid payment records cannot be deleted.'
      });
      return;
    }

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
          error: (err) => this.error = err?.error?.message || 'Failed to delete payment.'
        });
      }
    });
  }

  // --- APPROVE CASH PAYMENT ---
  approveCash(p: Payment): void {
    Swal.fire({
      title: 'Approve Cash Payment?',
      html: `
        <div class="text-start">
          <p>Verify that cash payment of <strong>₹${p.amount}</strong> for Maintenance Invoice #<strong>${p.maintenance?.id || p.maintenanceId}</strong> has been received.</p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Approve Cash',
      confirmButtonColor: '#198754'
    }).then((res) => {
      if (res.isConfirmed) {
        this.ps.approveCashPayment(p.id!).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Cash Payment Approved!',
              text: 'The payment has been marked as SUCCESS and maintenance as Paid.',
              timer: 1500,
              showConfirmButton: false
            });
            this.loadPayments();
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Approval Failed',
              text: err?.error?.message || 'Could not approve cash payment'
            });
          }
        });
      }
    });
  }

  // --- REJECT CASH PAYMENT ---
  rejectCash(p: Payment): void {
    Swal.fire({
      title: 'Reject Cash Payment?',
      input: 'text',
      inputLabel: 'Reason for rejection',
      inputPlaceholder: 'e.g. Cash not handed in',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Reject Payment',
      confirmButtonColor: '#dc3545'
    }).then((res) => {
      if (res.isConfirmed) {
        this.ps.rejectCashPayment(p.id!, res.value || '').subscribe({
          next: () => {
            Swal.fire({
              icon: 'info',
              title: 'Cash Payment Rejected',
              text: 'The payment status is now REJECTED and maintenance reverted to Pending.',
              timer: 1500,
              showConfirmButton: false
            });
            this.loadPayments();
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Rejection Failed',
              text: err?.error?.message || 'Could not reject cash payment'
            });
          }
        });
      }
    });
  }

  resetForm(): void {
    this.isEdit = false;
    this.originalPaymentStatus = '';
    this.currentPayment = { 
      maintenanceId: 1, 
      transactionId: '', 
      amount: 2500, 
      paymentMode: 'Cash', 
      paymentDate: new Date().toISOString().substring(0, 10), 
      status: 'SUCCESS' 
    };
    this.error = '';
    this.success = '';
  }
}
