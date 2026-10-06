import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {
  constructor(private router: Router) {}

  logout(): void {
    localStorage.removeItem('currentUser');
    Swal.fire({ icon: 'success', title: 'Logged Out', text: 'Admin session terminated.', timer: 1200, showConfirmButton: false });
    this.router.navigate(['/']);
  }
}