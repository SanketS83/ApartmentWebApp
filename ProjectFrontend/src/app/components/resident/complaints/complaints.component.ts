import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComplaintService } from '../../../services/complaint.service';
import { Complaint } from '../../../models/complaint.model';
import Swal from 'sweetalert2';
@Component({ selector: 'app-res-comp-page', standalone: true, imports: [CommonModule, FormsModule], templateUrl: './complaints.component.html', styleUrl: './complaints.component.css' })
export class ComplaintsComponent implements OnInit {
  list: Complaint[] = [];
  subject = ''; description = ''; category = 'Plumbing';
  constructor(private cs: ComplaintService) {}
  ngOnInit(): void { this.load(); }
  load(): void {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (user.id) this.cs.getComplaintsByResident(user.id).subscribe(d => this.list = d);
  }
  submit(): void {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!this.subject || !this.description) return;
    this.cs.createComplaint({ residentId: user.id, subject: this.subject, description: this.description, category: this.category }).subscribe(() => {
      Swal.fire({ icon: 'success', title: 'Ticket Submitted', timer: 1200 });
      this.subject = ''; this.description = ''; this.load();
    });
  }
}