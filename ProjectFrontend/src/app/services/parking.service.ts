import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Parking } from '../models/parking.model';

@Injectable({
  providedIn: 'root'
})
export class ParkingService {
  private endpoint = 'parking';

  constructor(private api: ApiService) {}

  getAllParking(): Observable<Parking[]> {
    return this.api.get<Parking[]>(this.endpoint);
  }

  getParkingById(id: number): Observable<Parking> {
    return this.api.get<Parking>(this.endpoint + '/' + id);
  }

  getParkingByFlat(flatId: number): Observable<Parking[]> {
    return this.api.get<Parking[]>(this.endpoint + '/flat/' + flatId);
  }

  createParking(data: any): Observable<Parking> {
    return this.api.post<Parking>(this.endpoint, data);
  }

  updateParking(id: number, data: any): Observable<Parking> {
    return this.api.put<Parking>(this.endpoint + '/' + id, data);
  }

  deleteParking(id: number): Observable<void> {
    return this.api.delete<void>(this.endpoint + '/' + id);
  }
}