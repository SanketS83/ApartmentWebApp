import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  step = 1;

  email = '';
  otp = ['', '', '', '', '', ''];
  password = '';
  confirmPassword = '';

  error = '';
  message = '';
  isSendingOtp = false;
  isVerifyingOtp = false;
  isResetting = false;
  timer = 60;
  interval: any;

  constructor(private auth: AuthService, private router: Router) { }

  // STEP 1 → SEND OTP
  sendOtp() {
    if (!this.email || !this.email.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Email Required',
        text: 'Please enter your registered email address'
      });
      return;
    }

    this.error = '';
    this.message = '';
    this.isSendingOtp = true;

    this.auth.sendOtp(this.email.trim()).subscribe({
      next: (res: any) => {
        setTimeout(() => {
          this.isSendingOtp = false;

          Swal.fire({
            icon: 'success',
            title: 'OTP Sent',
            text: res?.message || 'Check your registered email for the OTP',
            timer: 2000,
            showConfirmButton: false
          });

          this.step = 2;
          this.startTimer();
        }, 500);
      },
      error: (err) => {
        this.isSendingOtp = false;

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err?.error?.message || 'Email not registered with any resident'
        });
      }
    });
  }

  // STEP 2 → VERIFY OTP
  verifyOtp() {
    this.error = '';
    this.message = '';
    const otpValue = this.otp.join('').trim();

    if (otpValue.length < 6) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete OTP',
        text: 'Please enter all 6 digits of the OTP'
      });
      return;
    }

    this.isVerifyingOtp = true;

    this.auth.verifyOtp(this.email.trim(), otpValue).subscribe({
      next: (res: any) => {
        this.isVerifyingOtp = false;

        Swal.fire({
          icon: 'success',
          title: 'Verified',
          text: res?.message || 'OTP verified successfully',
          timer: 1500,
          showConfirmButton: false
        });

        this.step = 3;
      },
      error: (err) => {
        this.isVerifyingOtp = false;

        Swal.fire({
          icon: 'error',
          title: 'Invalid OTP',
          text: err?.error?.message || 'Invalid or expired OTP. Please try again.'
        });
      }
    });
  }

  // STEP 3 → RESET PASSWORD
  resetPassword() {
    this.error = '';
    this.message = '';

    if (!this.password || this.password.length < 4) {
      Swal.fire({
        icon: 'warning',
        title: 'Weak Password',
        text: 'Password must be at least 4 characters long'
      });
      return;
    }

    if (this.password !== this.confirmPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Mismatch',
        text: 'Passwords do not match'
      });
      return;
    }

    this.isResetting = true;

    this.auth.resetPassword(this.email.trim(), this.password).subscribe({
      next: (res: any) => {
        this.isResetting = false;

        Swal.fire({
          icon: 'success',
          title: 'Password Updated!',
          text: res?.message || 'Your password has been successfully reset.',
          confirmButtonText: 'Proceed to Login'
        }).then(() => {
          this.router.navigate(['/login']);
        });

        this.step = 4;
      },
      error: (err) => {
        this.isResetting = false;

        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: err?.error?.message || 'Failed to update password. Please try again.'
        });
      }
    });
  }

  // TIMER
  startTimer() {
    if (this.interval) clearInterval(this.interval);
    this.timer = 60;
    this.interval = setInterval(() => {
      this.timer--;
      if (this.timer <= 0) {
        clearInterval(this.interval);
      }
    }, 1000);
  }

  resendOtp() {
    if (this.timer === 0) {
      this.sendOtp();
    }
  }

  // OTP INPUT AUTO MOVE
  trackByIndex(index: number): number {
    return index;
  }

  moveNext(event: any, index: number) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    value = value.substring(0, 1);
    this.otp[index] = value;
    input.value = value;

    if (value && index < 5) {
      const nextInput = document.getElementById('otp' + (index + 1)) as HTMLInputElement;
      nextInput?.focus();
    }
  }

  handleBackspace(event: KeyboardEvent, index: number) {
    const input = event.target as HTMLInputElement;
    // if current box empty and backspace pressed
    if (event.key === 'Backspace' && !input.value && index > 0) {
      this.otp[index - 1] = '';
      const prevInput = document.getElementById('otp' + (index - 1)) as HTMLInputElement;
      prevInput?.focus();
    }
  }
}