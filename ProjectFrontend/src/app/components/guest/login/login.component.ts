import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ResidentService } from '../../../services/resident.service';
import { GuardService } from '../../../services/guard.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  selectedRole: 'RESIDENT' | 'GUARD' = 'RESIDENT';
  username = '';
  password = '';
  isLoading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private residentService: ResidentService,
    private guardService: GuardService
  ) {}

  ngOnInit(): void {
    const roleParam = this.route.snapshot.queryParams['role'];
    if (roleParam === 'guard') {
      this.selectedRole = 'GUARD';
    } else {
      this.selectedRole = 'RESIDENT';
    }
  }

  setRole(role: 'RESIDENT' | 'GUARD'): void {
    this.selectedRole = role;
    this.username = '';
    this.password = '';
  }

  onSubmit(): void {
    if (!this.username.trim() || !this.password.trim()) {
      Swal.fire({ icon: 'warning', title: 'Missing Info', text: 'Please fill both username/email and password.' });
      return;
    }
    this.isLoading = true;

    if (this.selectedRole === 'RESIDENT') {
      this.residentService.login({ username: this.username, password: this.password }).subscribe({
        next: (res) => {
          this.isLoading = false;
          localStorage.setItem('currentUser', JSON.stringify(res));
          Swal.fire({ icon: 'success', title: 'Welcome!', text: `Welcome back, ${res.name}`, timer: 1200, showConfirmButton: false })
            .then(() => this.router.navigate(['/resident/dashboard']));
        },
        error: (err) => {
          this.isLoading = false;
          Swal.fire({ icon: 'error', title: 'Login Failed', text: err.error || 'Invalid resident email or password.' });
        }
      });
    } else {
      this.guardService.login({ username: this.username, password: this.password }).subscribe({
        next: (res) => {
          this.isLoading = false;
          localStorage.setItem('currentUser', JSON.stringify(res));
          Swal.fire({ icon: 'success', title: 'Duty Active!', text: `Welcome Guard ${res.name}`, timer: 1200, showConfirmButton: false })
            .then(() => this.router.navigate(['/guard/dashboard']));
        },
        error: (err) => {
          this.isLoading = false;
          Swal.fire({ icon: 'error', title: 'Login Failed', text: err.error || 'Invalid guard username or password.' });
        }
      });
    }
  }
}