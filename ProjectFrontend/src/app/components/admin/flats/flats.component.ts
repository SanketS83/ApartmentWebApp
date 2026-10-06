import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlatService } from '../../../services/flat.service';
import { Flat } from '../../../models/flat.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-flats',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './flats.component.html',
  styleUrl: './flats.component.css'
})
export class FlatsComponent implements OnInit {
  flats: Flat[] = [];
  isEdit = false;
  success = '';
  error = '';
  currentFlat: Flat = { flatNumber: '', building: 'Tower A', floor: 1, flatType: '2 BHK', area: 1150, status: 'Available' };

  constructor(private fs: FlatService) {}

  ngOnInit(): void {
    this.loadFlats();
  }

  loadFlats(): void {
    this.fs.getAllFlats().subscribe({
      next: (data) => this.flats = data,
      error: (err) => this.error = 'Failed to load flats.'
    });
  }

  saveFlat(): void {
    if (!this.currentFlat.flatNumber) {
      this.error = 'Flat number is required.';
      return;
    }
    this.fs.createFlat(this.currentFlat).subscribe({
      next: () => {
        this.success = 'Flat added successfully!';
        this.resetForm();
        this.loadFlats();
      },
      error: (err) => this.error = 'Failed to add flat.'
    });
  }

  editFlat(f: Flat): void {
    this.isEdit = true;
    this.success = '';
    this.error = '';
    this.currentFlat = { ...f };
  }

  updateFlat(): void {
    if (!this.currentFlat.id) return;
    this.fs.updateFlat(this.currentFlat.id, this.currentFlat).subscribe({
      next: () => {
        this.success = 'Flat updated successfully!';
        this.resetForm();
        this.loadFlats();
      },
      error: (err) => this.error = 'Failed to update flat.'
    });
  }

  deleteFlat(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this flat?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      confirmButtonColor: '#dc3545'
    }).then((res) => {
      if (res.isConfirmed) {
        this.fs.deleteFlat(id).subscribe({
          next: () => {
            this.success = 'Flat deleted successfully!';
            this.loadFlats();
          },
          error: () => this.error = 'Failed to delete flat.'
        });
      }
    });
  }

  resetForm(): void {
    this.isEdit = false;
    this.currentFlat = { flatNumber: '', building: 'Tower A', floor: 1, flatType: '2 BHK', area: 1150, status: 'Available' };
    this.error = '';
  }
}
