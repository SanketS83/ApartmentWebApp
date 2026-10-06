import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoticeService } from '../../../services/notice.service';
import { Notice } from '../../../models/notice.model';
@Component({ selector: 'app-res-notices-page', standalone: true, imports: [CommonModule], templateUrl: './notices.component.html', styleUrl: './notices.component.css' })
export class NoticesComponent implements OnInit {
  notices: Notice[] = [];
  constructor(private ns: NoticeService) {}
  ngOnInit(): void { this.ns.getActiveNotices().subscribe(d => this.notices = d); }
}