import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-guard-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './guard-layout.component.html',
  styleUrl: './guard-layout.component.css'
})
export class GuardLayoutComponent {
  constructor(private router: Router) {}

  logout(): void {
    localStorage.removeItem('currentUser');
    Swal.fire({ icon: 'success', title: 'Shift Ended', text: 'Guard signed out successfully.', timer: 1200, showConfirmButton: false });
    this.router.navigate(['/']);
  }
}