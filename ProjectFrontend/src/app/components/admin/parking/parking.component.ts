import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ParkingService } from '../../../services/parking.service';
import { FlatService } from '../../../services/flat.service';
import { Parking } from '../../../models/parking.model';
import { Flat } from '../../../models/flat.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-parking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './parking.component.html',
  styleUrl: './parking.component.css'
})
export class ParkingComponent implements OnInit {
  parkingSlots: Parking[] = [];
  flats: Flat[] = [];
  isEdit = false;
  success = '';
  error = '';
  currentParking: any = { parkingNumber: '', flatId: null, vehicleNumber: '', status: 'Available' };

  constructor(private ps: ParkingService, private fs: FlatService) {}

  ngOnInit(): void {
    this.loadParking();
    this.loadFlats();
  }

  loadParking(): void {
    this.ps.getAllParking().subscribe({
      next: (d) => this.parkingSlots = d,
      error: () => this.error = 'Failed to load parking slots.'
    });
  }

  loadFlats(): void {
    this.fs.getAllFlats().subscribe({
      next: (d) => this.flats = d
    });
  }

  saveParking(): void {
    if (!this.currentParking.parkingNumber) {
      this.error = 'Parking Slot Number is required.';
      return;
    }
    this.ps.createParking(this.currentParking).subscribe({
      next: () => {
        this.success = 'Parking slot created successfully!';
        this.resetForm();
        this.loadParking();
      },
      error: () => this.error = 'Failed to create slot.'
    });
  }

  editParking(p: Parking): void {
    this.isEdit = true;
    this.success = '';
    this.error = '';
    this.currentParking = { ...p, flatId: p.flat ? p.flat.id : p.flatId };
  }

  updateParking(): void {
    if (!this.currentParking.id) return;
    this.ps.updateParking(this.currentParking.id, this.currentParking).subscribe({
      next: () => {
        this.success = 'Parking slot updated!';
        this.resetForm();
        this.loadParking();
      },
      error: () => this.error = 'Failed to update slot.'
    });
  }

  deleteParking(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this parking slot?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      confirmButtonColor: '#dc3545'
    }).then((res) => {
      if (res.isConfirmed) {
        this.ps.deleteParking(id).subscribe({
          next: () => {
            this.success = 'Slot deleted!';
            this.loadParking();
          },
          error: () => this.error = 'Failed to delete slot.'
        });
      }
    });
  }

  resetForm(): void {
    this.isEdit = false;
    this.currentParking = { parkingNumber: '', flatId: null, vehicleNumber: '', status: 'Available' };
    this.error = '';
  }
}
