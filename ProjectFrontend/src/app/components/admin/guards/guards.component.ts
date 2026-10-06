import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GuardService } from '../../../services/guard.service';
import { Guard } from '../../../models/guard.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-guards',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './guards.component.html',
  styleUrl: './guards.component.css'
})
export class GuardsComponent implements OnInit {
  guards: Guard[] = [];
  isEdit = false;
  success = '';
  error = '';
  currentGuard: Guard = { name: '', username: '', phone: '', password: '', shift: 'Day', isActive: true };

  constructor(private gs: GuardService) {}

  ngOnInit(): void {
    this.loadGuards();
  }

  loadGuards(): void {
    this.gs.getAllGuards().subscribe({
      next: (d) => this.guards = d,
      error: () => this.error = 'Failed to load guards.'
    });
  }

  saveGuard(): void {
    if (!this.currentGuard.name || !this.currentGuard.username) {
      this.error = 'Name and Username are required.';
      return;
    }
    this.gs.createGuard(this.currentGuard).subscribe({
      next: () => {
        this.success = 'Security Guard registered successfully!';
        this.resetForm();
        this.loadGuards();
      },
      error: () => this.error = 'Failed to create guard.'
    });
  }

  editGuard(g: Guard): void {
    this.isEdit = true;
    this.success = '';
    this.error = '';
    this.currentGuard = { ...g };
  }

  updateGuard(): void {
    if (!this.currentGuard.id) return;
    this.gs.updateGuard(this.currentGuard.id, this.currentGuard).subscribe({
      next: () => {
        this.success = 'Security Guard updated successfully!';
        this.resetForm();
        this.loadGuards();
      },
      error: () => this.error = 'Failed to update guard.'
    });
  }

  deleteGuard(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this guard?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      confirmButtonColor: '#dc3545'
    }).then((res) => {
      if (res.isConfirmed) {
        this.gs.deleteGuard(id).subscribe({
          next: () => {
            this.success = 'Guard deleted successfully!';
            this.loadGuards();
          },
          error: () => this.error = 'Failed to delete guard.'
        });
      }
    });
  }

  resetForm(): void {
    this.isEdit = false;
    this.currentGuard = { name: '', username: '', phone: '', password: '', shift: 'Day', isActive: true };
    this.error = '';
  }
}
