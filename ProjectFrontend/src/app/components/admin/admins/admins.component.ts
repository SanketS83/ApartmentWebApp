import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { SocietyAdmin } from '../../../models/admin.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admins',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admins.component.html',
  styleUrl: './admins.component.css'
})
export class AdminsComponent implements OnInit {
  admins: SocietyAdmin[] = [];
  isEdit = false;
  success = '';
  error = '';
  showPassword = false;
  currentAdmin: SocietyAdmin = {
    name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    isActive: true
  };

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadAdmins();
  }

  loadAdmins(): void {
    this.adminService.getAllAdmins().subscribe({
      next: (data) => this.admins = data,
      error: () => this.error = 'Failed to load society administrators.'
    });
  }

  saveAdmin(): void {
    if (!this.currentAdmin.name || !this.currentAdmin.username || !this.currentAdmin.email || !this.currentAdmin.password) {
      this.error = 'Name, Username, Email, and Password are required.';
      return;
    }

    this.adminService.createAdmin(this.currentAdmin).subscribe({
      next: () => {
        this.success = 'Society Admin created successfully!';
        this.resetForm();
        this.loadAdmins();
      },
      error: (err) => this.error = err.error?.message || 'Failed to create society admin.'
    });
  }

  editAdmin(admin: SocietyAdmin): void {
    this.isEdit = true;
    this.success = '';
    this.error = '';
    this.currentAdmin = { ...admin };
  }

  updateAdmin(): void {
    if (!this.currentAdmin.id) return;
    this.adminService.updateAdmin(this.currentAdmin.id, this.currentAdmin).subscribe({
      next: () => {
        this.success = 'Society Admin updated successfully!';
        this.resetForm();
        this.loadAdmins();
      },
      error: (err) => this.error = err.error?.message || 'Failed to update society admin.'
    });
  }

  deleteAdmin(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this administrator?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      confirmButtonColor: '#dc3545'
    }).then((res) => {
      if (res.isConfirmed) {
        this.adminService.deleteAdmin(id).subscribe({
          next: () => {
            this.success = 'Administrator removed successfully!';
            this.loadAdmins();
          },
          error: (err) => this.error = err.error?.message || 'Failed to delete administrator.'
        });
      }
    });
  }

  resetForm(): void {
    this.isEdit = false;
    this.currentAdmin = {
      name: '',
      username: '',
      email: '',
      phone: '',
      password: '',
      isActive: true
    };
    this.error = '';
  }
}
