import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VisitorService } from '../../../services/visitor.service';
import { ResidentService } from '../../../services/resident.service';
import { Resident } from '../../../models/resident.model';
import { Visitor } from '../../../models/visitor.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-guard-vis-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './visitors.component.html',
  styleUrl: './visitors.component.css'
})
export class VisitorsComponent implements OnInit {
  visitors: Visitor[] = [];
  residents: Resident[] = [];
  newV: any = { visitorName: '', phone: '', purpose: 'Guest', residentId: 0, visitDate: new Date().toISOString().split('T')[0] };

  constructor(private vs: VisitorService, private rs: ResidentService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.vs.getAllVisitors().subscribe(d => this.visitors = d);
    this.rs.getAllResidents().subscribe(d => this.residents = d);
  }

  log(): void {
    if (!this.newV.visitorName || !this.newV.phone || !this.newV.residentId) {
      Swal.fire('Required', 'Please fill visitor name, phone, and target resident.', 'warning');
      return;
    }
    this.vs.createVisitor(this.newV).subscribe({
      next: () => {
        Swal.fire({ icon: 'success', title: 'Check-In Confirmed', text: 'Visitor entry logged successfully.', timer: 1500, showConfirmButton: false });
        this.newV.visitorName = '';
        this.newV.phone = '';
        this.newV.purpose = 'Guest';
        this.load();
      },
      error: () => Swal.fire('Error', 'Failed to log visitor entry.', 'error')
    });
  }

  checkOut(id: number): void {
    this.vs.checkOutVisitor(id).subscribe({
      next: () => {
        Swal.fire({ icon: 'success', title: 'Checked Out', text: 'Visitor departure recorded.', timer: 1200, showConfirmButton: false });
        this.load();
      },
      error: () => Swal.fire('Error', 'Failed to record checkout.', 'error')
    });
  }
}