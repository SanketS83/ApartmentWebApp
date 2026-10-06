import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaintenanceService } from '../../../services/maintenance.service';
import { FlatService } from '../../../services/flat.service';
import { Maintenance } from '../../../models/maintenance.model';
import { Flat } from '../../../models/flat.model';
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
  isEdit = false;
  success = '';
  error = '';
  currentRecord: any = { flatId: 1, month: 'October', year: 2026, amount: 2500, status: 'Pending', dueDate: '2026-10-31', fineAmount: 0 };

  constructor(private ms: MaintenanceService, private fs: FlatService) {}

  ngOnInit(): void {
    this.loadRecords();
    this.loadFlats();
  }

  loadRecords(): void {
    this.ms.getAllMaintenance().subscribe({
      next: (d) => this.records = d,
      error: () => this.error = 'Failed to load maintenance records.'
    });
  }

  loadFlats(): void {
    this.fs.getAllFlats().subscribe({
      next: (d) => this.flats = d
    });
  }

  saveRecord(): void {
    this.ms.createMaintenance(this.currentRecord).subscribe({
      next: () => {
        this.success = 'Maintenance invoice generated successfully!';
        this.resetForm();
        this.loadRecords();
      },
      error: () => this.error = 'Failed to create record.'
    });
  }

  editRecord(m: Maintenance): void {
    this.isEdit = true;
    this.success = '';
    this.error = '';
    this.currentRecord = { ...m, flatId: m.flat ? m.flat.id : m.flatId };
  }

  updateRecord(): void {
    if (!this.currentRecord.id) return;
    this.ms.updateMaintenance(this.currentRecord.id, this.currentRecord).subscribe({
      next: () => {
        this.success = 'Maintenance invoice updated!';
        this.resetForm();
        this.loadRecords();
      },
      error: () => this.error = 'Failed to update record.'
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

  resetForm(): void {
    this.isEdit = false;
    this.currentRecord = { flatId: 1, month: 'October', year: 2026, amount: 2500, status: 'Pending', dueDate: '2026-10-31', fineAmount: 0 };
    this.error = '';
  }
}
