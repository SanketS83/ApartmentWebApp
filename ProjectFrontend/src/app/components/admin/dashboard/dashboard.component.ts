import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlatService } from '../../../services/flat.service';
import { ResidentService } from '../../../services/resident.service';
import { GuardService } from '../../../services/guard.service';
import { ComplaintService } from '../../../services/complaint.service';
import { NoticeService } from '../../../services/notice.service';

@Component({ selector: 'app-dashboard', standalone: true, imports: [CommonModule], templateUrl: './dashboard.component.html', styleUrl: './dashboard.component.css' })
export class DashboardComponent implements OnInit {
  flats = 0; residents = 0; guards = 0; complaints = 0; notices = 0;
  constructor(private fs: FlatService, private rs: ResidentService, private gs: GuardService, private cs: ComplaintService, private ns: NoticeService) {}
  ngOnInit(): void {
    this.fs.getAllFlats().subscribe(d => this.flats = d.length);
    this.rs.getAllResidents().subscribe(d => this.residents = d.length);
    this.gs.getAllGuards().subscribe(d => this.guards = d.length);
    this.cs.getAllComplaints().subscribe(d => this.complaints = d.length);
    this.ns.getAllNotices().subscribe(d => this.notices = d.length);
  }
}