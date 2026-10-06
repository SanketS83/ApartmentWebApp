import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { SocietyAdmin } from '../models/admin.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private endpoint = 'admins';

  constructor(private api: ApiService) {}

  getAllAdmins(): Observable<SocietyAdmin[]> {
    return this.api.get<SocietyAdmin[]>(this.endpoint);
  }

  getAdminById(id: number): Observable<SocietyAdmin> {
    return this.api.get<SocietyAdmin>(this.endpoint + '/' + id);
  }

  createAdmin(admin: any): Observable<SocietyAdmin> {
    return this.api.post<SocietyAdmin>(this.endpoint, admin);
  }

  updateAdmin(id: number, admin: any): Observable<SocietyAdmin> {
    return this.api.put<SocietyAdmin>(this.endpoint + '/' + id, admin);
  }

  deleteAdmin(id: number): Observable<void> {
    return this.api.delete<void>(this.endpoint + '/' + id);
  }

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.api.post<any>(this.endpoint + '/login', credentials);
  }
}