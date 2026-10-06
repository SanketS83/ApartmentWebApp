import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Flat } from '../models/flat.model';

@Injectable({
  providedIn: 'root'
})
export class FlatService {
  private endpoint = 'flats';

  constructor(private api: ApiService) {}

  getAllFlats(): Observable<Flat[]> {
    return this.api.get<Flat[]>(this.endpoint);
  }

  getFlatById(id: number): Observable<Flat> {
    return this.api.get<Flat>(this.endpoint + '/' + id);
  }

  createFlat(flat: Flat): Observable<Flat> {
    return this.api.post<Flat>(this.endpoint, flat);
  }

  updateFlat(id: number, flat: Flat): Observable<Flat> {
    return this.api.put<Flat>(this.endpoint + '/' + id, flat);
  }

  deleteFlat(id: number): Observable<void> {
    return this.api.delete<void>(this.endpoint + '/' + id);
  }
}