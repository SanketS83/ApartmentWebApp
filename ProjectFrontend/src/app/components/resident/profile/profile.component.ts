import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResidentService } from '../../../services/resident.service';
import { Resident } from '../../../models/resident.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-res-prof',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  res: Resident | null = null;
  editData: any = {
    id: null,
    name: '',
    email: '',
    phone: '',
    password: '',
    address: '',
    memberType: '',
    flatId: null
  };
  showPassword = false;
  isLoading = false;
  success = '';
  error = '';

  constructor(private rs: ResidentService) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (user.id) {
      this.rs.getResidentById(user.id).subscribe({
        next: (d) => {
          this.res = d;
          this.editData = {
            id: d.id,
            name: d.name,
            email: d.email,
            phone: d.phone,
            password: d.password,
            address: d.address || '',
            memberType: d.memberType,
            flatId: d.flat ? d.flat.id : null
          };
        },
        error: () => this.error = 'Failed to load resident profile.'
      });
    }
  }

  updateProfile(): void {
    if (!this.editData.id) return;
    if (!this.editData.name || !this.editData.email) {
      this.error = 'Name and Email are required.';
      return;
    }

    this.isLoading = true;
    this.success = '';
    this.error = '';

    this.rs.updateResident(this.editData.id, this.editData).subscribe({
      next: (updated) => {
        this.isLoading = false;
        this.res = updated;
        this.success = 'Profile details updated successfully!';

        // Update local session storage with new name/email
        const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
        user.name = updated.name;
        user.email = updated.email;
        user.username = updated.email;
        localStorage.setItem('currentUser', JSON.stringify(user));

        Swal.fire({
          icon: 'success',
          title: 'Profile Updated',
          text: 'Your profile changes have been saved.',
          timer: 1500,
          showConfirmButton: false
        });
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.error?.message || err.error || 'Failed to update profile.';
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}