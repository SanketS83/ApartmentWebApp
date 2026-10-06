import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlatService } from '../../../services/flat.service';
import { MaintenanceService } from '../../../services/maintenance.service';
import { ExpenseService } from '../../../services/expense.service';
import { ComplaintService } from '../../../services/complaint.service';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit {
  totalFlats = 0;
  occupiedFlats = 0;
  availableFlats = 0;
  totalCollected = 0;
  totalPending = 0;
  totalExpenses = 0;
  openComplaints = 0;
  resolvedComplaints = 0;

  constructor(
    private fs: FlatService,
    private ms: MaintenanceService,
    private es: ExpenseService,
    private cs: ComplaintService
  ) {}

  ngOnInit(): void {
    this.fs.getAllFlats().subscribe(flats => {
      this.totalFlats = flats.length;
      this.occupiedFlats = flats.filter(f => f.status === 'Occupied').length;
      this.availableFlats = flats.filter(f => f.status === 'Available').length;
    });

    this.ms.getAllMaintenance().subscribe(records => {
      this.totalCollected = records.filter(r => r.status === 'Paid').reduce((s, r) => s + (r.amount || 0), 0);
      this.totalPending = records.filter(r => r.status !== 'Paid').reduce((s, r) => s + (r.amount || 0), 0);
    });

    this.es.getAllExpenses().subscribe(expenses => {
      this.totalExpenses = expenses.reduce((s, e) => s + (e.amount || 0), 0);
    });

    this.cs.getAllComplaints().subscribe(complaints => {
      this.openComplaints = complaints.filter(c => c.status !== 'Resolved' && c.status !== 'Closed').length;
      this.resolvedComplaints = complaints.filter(c => c.status === 'Resolved' || c.status === 'Closed').length;
    });
  }

  printReport(): void {
    window.print();
  }
}
