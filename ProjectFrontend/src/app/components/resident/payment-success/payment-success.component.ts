import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PaymentService } from '../../../services/payment.service';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './payment-success.component.html',
  styleUrl: './payment-success.component.css'
})
export class PaymentSuccessComponent implements OnInit {
  sessionId = '';
  isLoading = true;
  isSuccess = false;
  errorMessage = '';
  paymentDetails: any = null;

  constructor(private route: ActivatedRoute, private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.sessionId = params['session_id'];
      if (this.sessionId) {
        this.verifyPayment(this.sessionId);
      } else {
        this.isLoading = false;
        this.errorMessage = 'No session ID found in payment callback.';
      }
    });
  }

  verifyPayment(sessionId: string): void {
    this.isLoading = true;
    this.paymentService.confirmPayment(sessionId).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.isSuccess = true;
        this.paymentDetails = res;
      },
      error: (err: any) => {
        this.isLoading = false;
        this.isSuccess = false;
        this.errorMessage = err?.error?.message || 'Payment confirmation failed. Please contact society office.';
      }
    });
  }
}
