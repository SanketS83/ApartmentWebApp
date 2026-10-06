import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-resident-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './resident-layout.component.html',
  styleUrl: './resident-layout.component.css'
})
export class ResidentLayoutComponent {
  constructor(private router: Router) {}

  logout(): void {
    localStorage.removeItem('currentUser');
    Swal.fire({ icon: 'success', title: 'Logged Out', text: 'Resident session closed.', timer: 1200, showConfirmButton: false });
    this.router.navigate(['/']);
  }
}