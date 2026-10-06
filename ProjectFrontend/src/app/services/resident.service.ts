import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Resident } from '../models/resident.model';

@Injectable({
  providedIn: 'root'
})
export class ResidentService {
  private endpoint = 'residents';

  constructor(private api: ApiService) {}

  getAllResidents(): Observable<Resident[]> {
    return this.api.get<Resident[]>(this.endpoint);
  }

  getResidentById(id: number): Observable<Resident> {
    return this.api.get<Resident>(this.endpoint + '/' + id);
  }

  createResident(resident: any): Observable<Resident> {
    return this.api.post<Resident>(this.endpoint, resident);
  }

  updateResident(id: number, resident: any): Observable<Resident> {
    return this.api.put<Resident>(this.endpoint + '/' + id, resident);
  }

  deleteResident(id: number): Observable<void> {
    return this.api.delete<void>(this.endpoint + '/' + id);
  }

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.api.post<any>(this.endpoint + '/login', credentials);
  }
}