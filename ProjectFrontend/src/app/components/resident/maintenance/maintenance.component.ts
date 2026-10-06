import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaintenanceService } from '../../../services/maintenance.service';
import { Maintenance } from '../../../models/maintenance.model';
@Component({ selector: 'app-res-maint-page', standalone: true, imports: [CommonModule], templateUrl: './maintenance.component.html', styleUrl: './maintenance.component.css' })
export class MaintenanceComponent implements OnInit {
  bills: Maintenance[] = [];
  constructor(private ms: MaintenanceService) {}
  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (user.id) this.ms.getMaintenanceByResident(user.id).subscribe(d => this.bills = d);
  }
}