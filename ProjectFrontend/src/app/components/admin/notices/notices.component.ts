import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NoticeService } from '../../../services/notice.service';
import { Notice } from '../../../models/notice.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-notices',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notices.component.html',
  styleUrl: './notices.component.css'
})
export class NoticesComponent implements OnInit {
  notices: Notice[] = [];
  isEdit = false;
  success = '';
  error = '';
  currentNotice: any = { title: '', description: '', noticeDate: new Date().toISOString().substring(0, 10), isActive: true };

  constructor(private ns: NoticeService) {}

  ngOnInit(): void {
    this.loadNotices();
  }

  loadNotices(): void {
    this.ns.getAllNotices().subscribe({
      next: (d) => this.notices = d,
      error: () => this.error = 'Failed to load notices.'
    });
  }

  saveNotice(): void {
    if (!this.currentNotice.title) {
      this.error = 'Title is required.';
      return;
    }
    this.ns.createNotice(this.currentNotice).subscribe({
      next: () => {
        this.success = 'Notice published successfully!';
        this.resetForm();
        this.loadNotices();
      },
      error: () => this.error = 'Failed to create notice.'
    });
  }

  editNotice(n: Notice): void {
    this.isEdit = true;
    this.success = '';
    this.error = '';
    this.currentNotice = { ...n };
  }

  updateNotice(): void {
    if (!this.currentNotice.id) return;
    this.ns.updateNotice(this.currentNotice.id, this.currentNotice).subscribe({
      next: () => {
        this.success = 'Notice updated!';
        this.resetForm();
        this.loadNotices();
      },
      error: () => this.error = 'Failed to update notice.'
    });
  }

  deleteNotice(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this notice?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      confirmButtonColor: '#dc3545'
    }).then((res) => {
      if (res.isConfirmed) {
        this.ns.deleteNotice(id).subscribe({
          next: () => {
            this.success = 'Notice deleted!';
            this.loadNotices();
          },
          error: () => this.error = 'Failed to delete notice.'
        });
      }
    });
  }

  resetForm(): void {
    this.isEdit = false;
    this.currentNotice = { title: '', description: '', noticeDate: new Date().toISOString().substring(0, 10), isActive: true };
    this.error = '';
  }
}
