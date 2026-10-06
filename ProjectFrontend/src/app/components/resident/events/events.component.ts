import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../../../services/event.service';
import { EventItem } from '../../../models/event.model';
@Component({ selector: 'app-res-events-page', standalone: true, imports: [CommonModule], templateUrl: './events.component.html', styleUrl: './events.component.css' })
export class EventsComponent implements OnInit {
  events: EventItem[] = [];
  constructor(private es: EventService) {}
  ngOnInit(): void { this.es.getAllEvents().subscribe(d => this.events = d); }
}