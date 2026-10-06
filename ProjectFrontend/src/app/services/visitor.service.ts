import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Visitor } from '../models/visitor.model';

@Injectable({
  providedIn: 'root'
})
export class VisitorService {
  private endpoint = 'visitors';

  constructor(private api: ApiService) {}

  getAllVisitors(): Observable<Visitor[]> {
    return this.api.get<Visitor[]>(this.endpoint);
  }

  getVisitorById(id: number): Observable<Visitor> {
    return this.api.get<Visitor>(this.endpoint + '/' + id);
  }

  getVisitorsByResident(residentId: number): Observable<Visitor[]> {
    return this.api.get<Visitor[]>(this.endpoint + '/resident/' + residentId);
  }

  createVisitor(data: any): Observable<Visitor> {
    return this.api.post<Visitor>(this.endpoint, data);
  }

  updateVisitor(id: number, data: any): Observable<Visitor> {
    return this.api.put<Visitor>(this.endpoint + '/' + id, data);
  }

  checkOutVisitor(id: number): Observable<Visitor> {
    return this.api.put<Visitor>(this.endpoint + '/' + id + '/checkout', {});
  }

  deleteVisitor(id: number): Observable<void> {
    return this.api.delete<void>(this.endpoint + '/' + id);
  }
}