import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaintenanceService } from '../../../services/maintenance.service';
import { FlatService } from '../../../services/flat.service';
import { ResidentService } from '../../../services/resident.service';
import { PaymentService } from '../../../services/payment.service';
import { Maintenance } from '../../../models/maintenance.model';
import { Flat } from '../../../models/flat.model';
import { Resident } from '../../../models/resident.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-maintenance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './maintenance.component.html',
  styleUrl: './maintenance.component.css'
})
export class MaintenanceComponent implements OnInit {
  records: Maintenance[] = [];
  flats: Flat[] = [];
  residents: Resident[] = [];
  isEdit = false;
  success = '';
  error = '';
  currentRecord: any = { 
    flatId: null, 
    residentId: null,
    month: 'October', 
    year: 2026, 
    amount: 2500, 
    status: 'Pending', 
    dueDate: '2026-10-31' 
  };

  constructor(
    private ms: MaintenanceService, 
    private fs: FlatService,
    private rs: ResidentService,
    private ps: PaymentService
  ) {}

  ngOnInit(): void {
    this.loadRecords();
    this.loadFlats();
    this.loadResidents();
  }

  loadRecords(): void {
    this.ms.getAllMaintenance().subscribe({
      next: (d) => this.records = d,
      error: () => this.error = 'Failed to load maintenance records.'
    });
  }

  loadFlats(): void {
    this.fs.getAllFlats().subscribe({
      next: (d) => {
        this.flats = d;
        if (this.flats.length > 0 && !this.currentRecord.flatId) {
          this.currentRecord.flatId = this.flats[0].id;
          this.onFlatChange();
        }
      }
    });
  }

  loadResidents(): void {
    this.rs.getAllResidents().subscribe({
      next: (d) => this.residents = d
    });
  }

  onFlatChange(): void {
    const selectedFlat = this.flats.find(f => f.id === this.currentRecord.flatId);
    if (selectedFlat) {
      const match = this.residents.find(r => r.flat && r.flat.id === selectedFlat.id);
      if (match) {
        this.currentRecord.residentId = match.id;
      }
    }
  }

  saveRecord(): void {
    if (!this.currentRecord.flatId) {
      this.error = 'Please select a flat';
      return;
    }

    this.ms.createMaintenance(this.currentRecord).subscribe({
      next: () => {
        this.success = 'Maintenance invoice generated successfully!';
        this.resetForm();
        this.loadRecords();
      },
      error: (err) => this.error = err?.error?.message || 'Failed to create record.'
    });
  }

  editRecord(m: Maintenance): void {
    this.isEdit = true;
    this.success = '';
    this.error = '';
    this.currentRecord = { 
      ...m, 
      flatId: m.flat ? m.flat.id : m.flatId,
      residentId: m.resident ? m.resident.id : m.residentId 
    };
  }

  updateRecord(): void {
    if (!this.currentRecord.id) return;
    this.ms.updateMaintenance(this.currentRecord.id, this.currentRecord).subscribe({
      next: () => {
        this.success = 'Maintenance invoice updated!';
        this.resetForm();
        this.loadRecords();
      },
      error: (err) => this.error = err?.error?.message || 'Failed to update record.'
    });
  }

  deleteRecord(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this invoice?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      confirmButtonColor: '#dc3545'
    }).then((res) => {
      if (res.isConfirmed) {
        this.ms.deleteMaintenance(id).subscribe({
          next: () => {
            this.success = 'Invoice deleted successfully!';
            this.loadRecords();
          },
          error: () => this.error = 'Failed to delete record.'
        });
      }
    });
  }

  // --- ADMIN MANUAL CASH PAYMENT APPROVAL ---
  approveCashPayment(m: Maintenance): void {
    Swal.fire({
      title: 'Approve Cash Payment?',
      html: `
        <div class="text-start">
          <p>Confirm that cash of <strong>₹${m.amount}</strong> for <strong>Flat ${m.flat?.building} - ${m.flat?.flatNumber}</strong> (${m.month} ${m.year}) has been received at the society office.</p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Approve Cash',
      confirmButtonColor: '#198754'
    }).then((res) => {
      if (res.isConfirmed) {
        this.ps.approveMaintenanceCash(m.id!).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Cash Payment Approved!',
              text: 'Invoice status is now updated to Paid.',
              timer: 1500,
              showConfirmButton: false
            });
            this.loadRecords();
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Approval Failed',
              text: err?.error?.message || 'Could not approve cash payment'
            });
          }
        });
      }
    });
  }

  // --- ADMIN REJECT CASH PAYMENT ---
  rejectCashPayment(m: Maintenance): void {
    Swal.fire({
      title: 'Reject Cash Payment?',
      input: 'text',
      inputLabel: 'Reason for rejection (Optional)',
      inputPlaceholder: 'e.g. Cash not received at office',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Reject Payment',
      confirmButtonColor: '#dc3545'
    }).then((res) => {
      if (res.isConfirmed) {
        const updated = { ...m, status: 'Pending' };
        this.ms.updateMaintenance(m.id!, updated).subscribe({
          next: () => {
            Swal.fire({
              icon: 'info',
              title: 'Cash Payment Rejected',
              text: 'Invoice has been reverted to Pending status.',
              timer: 1500,
              showConfirmButton: false
            });
            this.loadRecords();
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Rejection Failed',
              text: err?.error?.message || 'Failed to reject cash payment'
            });
          }
        });
      }
    });
  }

  resetForm(): void {
    this.isEdit = false;
    this.currentRecord = { 
      flatId: this.flats.length > 0 ? this.flats[0].id : null, 
      residentId: null,
      month: 'October', 
      year: 2026, 
      amount: 2500, 
      status: 'Pending', 
      dueDate: '2026-10-31' 
    };
    this.onFlatChange();
    this.error = '';
  }
}
