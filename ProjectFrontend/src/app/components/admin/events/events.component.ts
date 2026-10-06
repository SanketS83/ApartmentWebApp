import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../../services/event.service';
import { EventItem } from '../../../models/event.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsComponent implements OnInit {
  events: EventItem[] = [];
  isEdit = false;
  success = '';
  error = '';
  currentEvent: any = { title: '', description: '', eventDate: '', eventTime: '18:00', venue: 'Community Clubhouse' };

  constructor(private es: EventService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.es.getAllEvents().subscribe({
      next: (d) => this.events = d,
      error: () => this.error = 'Failed to load events.'
    });
  }

  saveEvent(): void {
    if (!this.currentEvent.title) {
      this.error = 'Event title is required.';
      return;
    }
    this.es.createEvent(this.currentEvent).subscribe({
      next: () => {
        this.success = 'Society event scheduled successfully!';
        this.resetForm();
        this.loadEvents();
      },
      error: () => this.error = 'Failed to schedule event.'
    });
  }

  editEvent(e: EventItem): void {
    this.isEdit = true;
    this.success = '';
    this.error = '';
    this.currentEvent = { ...e };
  }

  updateEvent(): void {
    if (!this.currentEvent.id) return;
    this.es.updateEvent(this.currentEvent.id, this.currentEvent).subscribe({
      next: () => {
        this.success = 'Event details updated!';
        this.resetForm();
        this.loadEvents();
      },
      error: () => this.error = 'Failed to update event.'
    });
  }

  deleteEvent(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to cancel and delete this event?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      confirmButtonColor: '#dc3545'
    }).then((res) => {
      if (res.isConfirmed) {
        this.es.deleteEvent(id).subscribe({
          next: () => {
            this.success = 'Event deleted!';
            this.loadEvents();
          },
          error: () => this.error = 'Failed to delete event.'
        });
      }
    });
  }

  resetForm(): void {
    this.isEdit = false;
    this.currentEvent = { title: '', description: '', eventDate: '', eventTime: '18:00', venue: 'Community Clubhouse' };
    this.error = '';
  }
}
