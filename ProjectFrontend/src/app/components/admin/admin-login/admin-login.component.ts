import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent {
  username = '';
  password = '';
  isLoading = false;

  constructor(private router: Router, private adminService: AdminService) {}

  login(): void {
    if (!this.username.trim() || !this.password.trim()) {
      Swal.fire({ icon: 'warning', title: 'Required', text: 'Please enter username and password.' });
      return;
    }
    this.isLoading = true;
    this.adminService.login({ username: this.username, password: this.password }).subscribe({
      next: (res) => {
        this.isLoading = false;
        localStorage.setItem('currentUser', JSON.stringify(res));
        Swal.fire({ icon: 'success', title: 'Welcome Admin!', text: `Authorized as ${res.name}`, timer: 1200, showConfirmButton: false })
          .then(() => this.router.navigate(['/admin/dashboard']));
      },
      error: (err) => {
        this.isLoading = false;
        Swal.fire({ icon: 'error', title: 'Access Denied', text: err.error || 'Invalid administrator credentials.' });
      }
    });
  }
}