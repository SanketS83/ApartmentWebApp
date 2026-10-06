import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Staff } from '../models/staff.model';

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  private endpoint = 'staff';

  constructor(private api: ApiService) {}

  getAllStaff(): Observable<Staff[]> {
    return this.api.get<Staff[]>(this.endpoint);
  }

  getStaffById(id: number): Observable<Staff> {
    return this.api.get<Staff>(this.endpoint + '/' + id);
  }

  createStaff(staff: Staff): Observable<Staff> {
    return this.api.post<Staff>(this.endpoint, staff);
  }

  updateStaff(id: number, staff: Staff): Observable<Staff> {
    return this.api.put<Staff>(this.endpoint + '/' + id, staff);
  }

  deleteStaff(id: number): Observable<void> {
    return this.api.delete<void>(this.endpoint + '/' + id);
  }
}