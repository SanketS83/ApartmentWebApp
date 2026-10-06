import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({ selector: 'app-guard-dash-page', standalone: true, imports: [CommonModule, RouterModule], templateUrl: './dashboard.component.html', styleUrl: './dashboard.component.css' })
export class DashboardComponent implements OnInit {
  user: any = null;
  ngOnInit(): void { this.user = JSON.parse(localStorage.getItem('currentUser') || '{}'); }
}