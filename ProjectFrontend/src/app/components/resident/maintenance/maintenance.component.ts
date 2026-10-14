import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaintenanceService } from '../../../services/maintenance.service';
import { PaymentService } from '../../../services/payment.service';
import { Maintenance } from '../../../models/maintenance.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-res-maint-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './maintenance.component.html',
  styleUrl: './maintenance.component.css'
})
export class MaintenanceComponent implements OnInit {
  bills: Maintenance[] = [];
  currentUser: any = null;
  isLoading = false;

  // Pay Modal state
  isPayModalOpen = false;
  selectedBill: Maintenance | null = null;
  paymentMethod: 'ONLINE' | 'CASH' = 'ONLINE';
  cashRemarks = '';
  isProcessing = false;

  constructor(
    private ms: MaintenanceService,
    private ps: PaymentService
  ) {}

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.loadBills();
  }

  loadBills(): void {
    if (this.currentUser && this.currentUser.id) {
      this.isLoading = true;
      this.ms.getMaintenanceByResident(this.currentUser.id).subscribe({
        next: (d) => {
          this.bills = d;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        }
      });
    }
  }

  openPayModal(bill: Maintenance): void {
    this.selectedBill = bill;
    this.paymentMethod = 'ONLINE';
    this.cashRemarks = '';
    this.isPayModalOpen = true;
  }

  closePayModal(): void {
    this.isPayModalOpen = false;
    this.selectedBill = null;
    this.isProcessing = false;
  }

  processPayment(): void {
    if (!this.selectedBill || !this.selectedBill.id) return;

    if (this.paymentMethod === 'CASH') {
      this.submitCashPayment();
    } else {
      this.submitOnlinePayment();
    }
  }

  // 1. CASH PAYMENT
  private submitCashPayment(): void {
    if (!this.selectedBill || !this.selectedBill.id) return;

    this.isProcessing = true;
    const req = {
      maintenanceId: this.selectedBill.id,
      residentId: this.currentUser.id,
      remarks: this.cashRemarks ? this.cashRemarks : 'Cash payment submitted by resident, awaiting Admin approval'
    };

    this.ps.recordCashPayment(req).subscribe({
      next: () => {
        this.isProcessing = false;
        this.closePayModal();

        Swal.fire({
          icon: 'info',
          title: 'Cash Payment Submitted',
          html: `
            <div class="text-start">
              <p>Your cash payment request of <strong>₹${this.selectedBill?.amount}</strong> has been recorded.</p>
              <div class="alert alert-warning py-2 mb-2">
                <strong>Status:</strong> Pending Cash Approval
              </div>
              <p class="small text-muted mb-0">Please hand over the cash amount to the Society Office/Admin. The admin will verify and manually approve the transaction.</p>
            </div>
          `,
          confirmButtonText: 'Understood'
        });

        this.loadBills();
      },
      error: (err) => {
        this.isProcessing = false;
        Swal.fire({
          icon: 'error',
          title: 'Payment Submission Failed',
          text: err?.error?.message || 'Failed to submit cash payment request'
        });
      }
    });
  }

  // 2. ONLINE PAYMENT (STRIPE GATEWAY)
  private submitOnlinePayment(): void {
    if (!this.selectedBill || !this.selectedBill.id) return;

    this.isProcessing = true;

    this.ps.createStripeSession(this.selectedBill.id).subscribe({
      next: (res: { url: string; sessionId: string }) => {
        if (res.url) {
          Swal.fire({
            title: 'Redirecting to Gateway...',
            text: 'Opening secure payment gateway...',
            timer: 1500,
            showConfirmButton: false,
            didOpen: () => {
              Swal.showLoading();
            }
          }).then(() => {
            window.location.href = res.url;
          });
        } else {
          this.isProcessing = false;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Payment session URL not received from gateway'
          });
        }
      },
      error: (err) => {
        this.isProcessing = false;
        Swal.fire({
          icon: 'error',
          title: 'Payment Gateway Error',
          text: err?.error?.message || 'Could not initiate Stripe payment session. Please try again later.'
        });
      }
    });
  }
}