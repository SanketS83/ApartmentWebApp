import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { EventItem } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private endpoint = 'events';

  constructor(private api: ApiService) {}

  getAllEvents(): Observable<EventItem[]> {
    return this.api.get<EventItem[]>(this.endpoint);
  }

  getEventById(id: number): Observable<EventItem> {
    return this.api.get<EventItem>(this.endpoint + '/' + id);
  }

  createEvent(event: EventItem): Observable<EventItem> {
    return this.api.post<EventItem>(this.endpoint, event);
  }

  updateEvent(id: number, event: EventItem): Observable<EventItem> {
    return this.api.put<EventItem>(this.endpoint + '/' + id, event);
  }

  deleteEvent(id: number): Observable<void> {
    return this.api.delete<void>(this.endpoint + '/' + id);
  }
}