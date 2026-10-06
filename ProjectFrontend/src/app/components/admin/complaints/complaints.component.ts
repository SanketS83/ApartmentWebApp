import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComplaintService } from '../../../services/complaint.service';
import { Complaint } from '../../../models/complaint.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-complaints',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './complaints.component.html',
  styleUrl: './complaints.component.css'
})
export class ComplaintsComponent implements OnInit {
  complaints: Complaint[] = [];
  isEdit = false;
  success = '';
  error = '';
  currentComplaint: any = { residentId: 1, subject: '', category: 'Plumbing', priority: 'Medium', status: 'Open', description: '', adminReply: '' };

  constructor(private cs: ComplaintService) {}

  ngOnInit(): void {
    this.loadComplaints();
  }

  loadComplaints(): void {
    this.cs.getAllComplaints().subscribe({
      next: (d) => this.complaints = d,
      error: () => this.error = 'Failed to load complaints.'
    });
  }

  saveComplaint(): void {
    if (!this.currentComplaint.subject) {
      this.error = 'Subject is required.';
      return;
    }
    this.cs.createComplaint(this.currentComplaint).subscribe({
      next: () => {
        this.success = 'Complaint ticket created!';
        this.resetForm();
        this.loadComplaints();
      },
      error: () => this.error = 'Failed to create complaint.'
    });
  }

  editComplaint(c: Complaint): void {
    this.isEdit = true;
    this.success = '';
    this.error = '';
    this.currentComplaint = { ...c, residentId: c.resident ? c.resident.id : c.residentId };
  }

  updateComplaint(): void {
    if (!this.currentComplaint.id) return;
    this.cs.updateComplaint(this.currentComplaint.id, this.currentComplaint).subscribe({
      next: () => {
        this.success = 'Complaint status updated!';
        this.resetForm();
        this.loadComplaints();
      },
      error: () => this.error = 'Failed to update complaint.'
    });
  }

  deleteComplaint(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this complaint?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      confirmButtonColor: '#dc3545'
    }).then((res) => {
      if (res.isConfirmed) {
        this.cs.deleteComplaint(id).subscribe({
          next: () => {
            this.success = 'Complaint deleted!';
            this.loadComplaints();
          },
          error: () => this.error = 'Failed to delete complaint.'
        });
      }
    });
  }

  resetForm(): void {
    this.isEdit = false;
    this.currentComplaint = { residentId: 1, subject: '', category: 'Plumbing', priority: 'Medium', status: 'Open', description: '', adminReply: '' };
    this.error = '';
  }
}
