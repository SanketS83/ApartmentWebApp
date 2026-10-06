import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Maintenance } from '../models/maintenance.model';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {
  private endpoint = 'maintenance';

  constructor(private api: ApiService) {}

  getAllMaintenance(): Observable<Maintenance[]> {
    return this.api.get<Maintenance[]>(this.endpoint);
  }

  getMaintenanceById(id: number): Observable<Maintenance> {
    return this.api.get<Maintenance>(this.endpoint + '/' + id);
  }

  getMaintenanceByResident(residentId: number): Observable<Maintenance[]> {
    return this.api.get<Maintenance[]>(this.endpoint + '/resident/' + residentId);
  }

  createMaintenance(data: any): Observable<Maintenance> {
    return this.api.post<Maintenance>(this.endpoint, data);
  }

  updateMaintenance(id: number, data: any): Observable<Maintenance> {
    return this.api.put<Maintenance>(this.endpoint + '/' + id, data);
  }

  deleteMaintenance(id: number): Observable<void> {
    return this.api.delete<void>(this.endpoint + '/' + id);
  }
}