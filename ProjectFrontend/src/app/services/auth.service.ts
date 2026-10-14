import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  sendOtp(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/send-otp?email=${encodeURIComponent(email)}`, {});
  }

  verifyOtp(email: string, otp: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/verify-otp?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`, {});
  }

  resetPassword(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/reset-password?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`, {});
  }
}
