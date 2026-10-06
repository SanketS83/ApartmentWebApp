import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  email = '';
  constructor(private router: Router) {}
  send(): void {
    if (!this.email) return;
    Swal.fire({ icon: 'info', title: 'Request Sent', text: 'Please contact society admin to reset your credentials.' })
      .then(() => this.router.navigate(['/login']));
  }
}