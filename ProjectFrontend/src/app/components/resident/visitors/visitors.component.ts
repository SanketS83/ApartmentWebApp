import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisitorService } from '../../../services/visitor.service';
import { Visitor } from '../../../models/visitor.model';
@Component({ selector: 'app-res-vis-page', standalone: true, imports: [CommonModule], templateUrl: './visitors.component.html', styleUrl: './visitors.component.css' })
export class VisitorsComponent implements OnInit {
  visitors: Visitor[] = [];
  constructor(private vs: VisitorService) {}
  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (user.id) this.vs.getVisitorsByResident(user.id).subscribe(d => this.visitors = d);
  }
}