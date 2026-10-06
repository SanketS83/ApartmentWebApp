import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Notice } from '../models/notice.model';

@Injectable({
  providedIn: 'root'
})
export class NoticeService {
  private endpoint = 'notices';

  constructor(private api: ApiService) {}

  getAllNotices(): Observable<Notice[]> {
    return this.api.get<Notice[]>(this.endpoint);
  }

  getActiveNotices(): Observable<Notice[]> {
    return this.api.get<Notice[]>(this.endpoint + '/active');
  }

  getNoticeById(id: number): Observable<Notice> {
    return this.api.get<Notice>(this.endpoint + '/' + id);
  }

  createNotice(notice: Notice): Observable<Notice> {
    return this.api.post<Notice>(this.endpoint, notice);
  }

  updateNotice(id: number, notice: Notice): Observable<Notice> {
    return this.api.put<Notice>(this.endpoint + '/' + id, notice);
  }

  deleteNotice(id: number): Observable<void> {
    return this.api.delete<void>(this.endpoint + '/' + id);
  }
}