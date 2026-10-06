import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoticeService } from '../../../services/notice.service';
import { Notice } from '../../../models/notice.model';
@Component({ selector: 'app-res-dash', standalone: true, imports: [CommonModule], templateUrl: './dashboard.component.html', styleUrl: './dashboard.component.css' })
export class DashboardComponent implements OnInit {
  user: any = null;
  notices: Notice[] = [];
  constructor(private ns: NoticeService) {}
  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.ns.getActiveNotices().subscribe(d => this.notices = d.slice(0, 3));
  }
}