import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VisitorService } from '../../../services/visitor.service';
import { ResidentService } from '../../../services/resident.service';
import { Visitor } from '../../../models/visitor.model';
import { Resident } from '../../../models/resident.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-visitors',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './visitors.component.html',
  styleUrl: './visitors.component.css'
})
export class VisitorsComponent implements OnInit {
  visitors: Visitor[] = [];
  residents: Resident[] = [];
  isEdit = false;
  success = '';
  error = '';
  currentVisitor: any = { visitorName: '', phone: '', residentId: 1, purpose: 'Guest', visitDate: new Date().toISOString().substring(0, 10) };

  constructor(private vs: VisitorService, private rs: ResidentService) {}

  ngOnInit(): void {
    this.loadVisitors();
    this.loadResidents();
  }

  loadVisitors(): void {
    this.vs.getAllVisitors().subscribe({
      next: (d) => this.visitors = d,
      error: () => this.error = 'Failed to load visitors.'
    });
  }

  loadResidents(): void {
    this.rs.getAllResidents().subscribe({
      next: (d) => this.residents = d
    });
  }

  saveVisitor(): void {
    if (!this.currentVisitor.visitorName) {
      this.error = 'Visitor name is required.';
      return;
    }
    this.vs.createVisitor(this.currentVisitor).subscribe({
      next: () => {
        this.success = 'Visitor entry logged successfully!';
        this.resetForm();
        this.loadVisitors();
      },
      error: () => this.error = 'Failed to log visitor.'
    });
  }

  editVisitor(v: Visitor): void {
    this.isEdit = true;
    this.success = '';
    this.error = '';
    this.currentVisitor = { ...v, residentId: v.resident ? v.resident.id : v.residentId };
  }

  updateVisitor(): void {
    if (!this.currentVisitor.id) return;
    this.vs.updateVisitor(this.currentVisitor.id, this.currentVisitor).subscribe({
      next: () => {
        this.success = 'Visitor record updated!';
        this.resetForm();
        this.loadVisitors();
      },
      error: () => this.error = 'Failed to update visitor.'
    });
  }

  checkOutVisitor(id: number): void {
    this.vs.checkOutVisitor(id).subscribe({
      next: () => {
        this.success = 'Visitor checked out successfully!';
        this.loadVisitors();
      },
      error: () => this.error = 'Failed to check out visitor.'
    });
  }

  deleteVisitor(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this visitor record?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      confirmButtonColor: '#dc3545'
    }).then((res) => {
      if (res.isConfirmed) {
        this.vs.deleteVisitor(id).subscribe({
          next: () => {
            this.success = 'Visitor log deleted!';
            this.loadVisitors();
          },
          error: () => this.error = 'Failed to delete visitor.'
        });
      }
    });
  }

  resetForm(): void {
    this.isEdit = false;
    this.currentVisitor = { visitorName: '', phone: '', residentId: 1, purpose: 'Guest', visitDate: new Date().toISOString().substring(0, 10) };
    this.error = '';
  }
}
