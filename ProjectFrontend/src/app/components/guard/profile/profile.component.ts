import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({ selector: 'app-guard-prof-page', standalone: true, imports: [CommonModule], templateUrl: './profile.component.html', styleUrl: './profile.component.css' })
export class ProfileComponent implements OnInit {
  user: any = null;
  ngOnInit(): void { this.user = JSON.parse(localStorage.getItem('currentUser') || '{}'); }
}