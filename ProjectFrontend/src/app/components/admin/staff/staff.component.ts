import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StaffService } from '../../../services/staff.service';
import { Staff } from '../../../models/staff.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-staff',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './staff.component.html',
  styleUrl: './staff.component.css'
})
export class StaffComponent implements OnInit {
  staffList: Staff[] = [];
  isEdit = false;
  success = '';
  error = '';
  currentStaff: any = { name: '', phone: '', designation: 'Electrician', salary: 15000, joiningDate: '', status: 'Active' };

  constructor(private ss: StaffService) {}

  ngOnInit(): void {
    this.loadStaff();
  }

  loadStaff(): void {
    this.ss.getAllStaff().subscribe({
      next: (d) => this.staffList = d,
      error: () => this.error = 'Failed to load staff.'
    });
  }

  saveStaff(): void {
    if (!this.currentStaff.name) {
      this.error = 'Staff name is required.';
      return;
    }
    this.ss.createStaff(this.currentStaff).subscribe({
      next: () => {
        this.success = 'Staff member added successfully!';
        this.resetForm();
        this.loadStaff();
      },
      error: () => this.error = 'Failed to add staff.'
    });
  }

  editStaff(s: Staff): void {
    this.isEdit = true;
    this.success = '';
    this.error = '';
    this.currentStaff = { ...s };
  }

  updateStaff(): void {
    if (!this.currentStaff.id) return;
    this.ss.updateStaff(this.currentStaff.id, this.currentStaff).subscribe({
      next: () => {
        this.success = 'Staff profile updated!';
        this.resetForm();
        this.loadStaff();
      },
      error: () => this.error = 'Failed to update staff.'
    });
  }

  deleteStaff(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this staff record?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      confirmButtonColor: '#dc3545'
    }).then((res) => {
      if (res.isConfirmed) {
        this.ss.deleteStaff(id).subscribe({
          next: () => {
            this.success = 'Staff record deleted!';
            this.loadStaff();
          },
          error: () => this.error = 'Failed to delete staff.'
        });
      }
    });
  }

  resetForm(): void {
    this.isEdit = false;
    this.currentStaff = { name: '', phone: '', designation: 'Electrician', salary: 15000, joiningDate: '', status: 'Active' };
    this.error = '';
  }
}
