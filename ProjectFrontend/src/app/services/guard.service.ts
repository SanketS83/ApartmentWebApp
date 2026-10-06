import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Guard } from '../models/guard.model';

@Injectable({
  providedIn: 'root'
})
export class GuardService {
  private endpoint = 'guards';

  constructor(private api: ApiService) {}

  getAllGuards(): Observable<Guard[]> {
    return this.api.get<Guard[]>(this.endpoint);
  }

  getGuardById(id: number): Observable<Guard> {
    return this.api.get<Guard>(this.endpoint + '/' + id);
  }

  createGuard(guard: any): Observable<Guard> {
    return this.api.post<Guard>(this.endpoint, guard);
  }

  updateGuard(id: number, guard: any): Observable<Guard> {
    return this.api.put<Guard>(this.endpoint + '/' + id, guard);
  }

  deleteGuard(id: number): Observable<void> {
    return this.api.delete<void>(this.endpoint + '/' + id);
  }

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.api.post<any>(this.endpoint + '/login', credentials);
  }
}