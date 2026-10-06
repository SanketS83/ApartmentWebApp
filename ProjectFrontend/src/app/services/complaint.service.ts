import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Complaint } from '../models/complaint.model';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {
  private endpoint = 'complaints';

  constructor(private api: ApiService) {}

  getAllComplaints(): Observable<Complaint[]> {
    return this.api.get<Complaint[]>(this.endpoint);
  }

  getComplaintById(id: number): Observable<Complaint> {
    return this.api.get<Complaint>(this.endpoint + '/' + id);
  }

  getComplaintsByResident(residentId: number): Observable<Complaint[]> {
    return this.api.get<Complaint[]>(this.endpoint + '/resident/' + residentId);
  }

  createComplaint(data: any): Observable<Complaint> {
    return this.api.post<Complaint>(this.endpoint, data);
  }

  updateComplaint(id: number, data: any): Observable<Complaint> {
    return this.api.put<Complaint>(this.endpoint + '/' + id, data);
  }

  deleteComplaint(id: number): Observable<void> {
    return this.api.delete<void>(this.endpoint + '/' + id);
  }
}