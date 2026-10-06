import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResidentService } from '../../../services/resident.service';
import { FlatService } from '../../../services/flat.service';
import { Resident } from '../../../models/resident.model';
import { Flat } from '../../../models/flat.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-residents',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './residents.component.html',
  styleUrl: './residents.component.css'
})
export class ResidentsComponent implements OnInit {
  residents: Resident[] = [];
  flats: Flat[] = [];
  isEdit = false;
  success = '';
  error = '';
  currentResident: any = { name: '', email: '', phone: '', password: '', memberType: 'Owner', flatId: null, address: '', isActive: true };

  constructor(private rs: ResidentService, private fs: FlatService) { }

  ngOnInit(): void {
    this.loadResidents();
    this.loadFlats();
  }

  loadResidents(): void {
    this.rs.getAllResidents().subscribe({
      next: (d) => this.residents = d,
      error: () => this.error = 'Failed to load residents.'
    });
  }

  loadFlats(): void {
    this.fs.getAllFlats().subscribe({
      next: (d) => this.flats = d
    });
  }

  isFlatAllocatedToOther(flatId: number): boolean {
    if (!flatId) return false;
    const resident = this.residents.find(r => r.flat && r.flat.id === flatId);
    if (!resident) return false;
    // If editing, allow keeping the resident's currently assigned flat
    if (this.isEdit && this.currentResident.id && resident.id === this.currentResident.id) {
      return false;
    }
    return true;
  }

  getFlatOccupantName(flatId: number): string {
    const resident = this.residents.find(r => r.flat && r.flat.id === flatId);
    return resident ? resident.name : '';
  }

  saveResident(): void {
    if (!this.currentResident.name || !this.currentResident.email) {
      this.error = 'Name and Email are required.';
      return;
    }
    if (this.currentResident.flatId && this.isFlatAllocatedToOther(this.currentResident.flatId)) {
      this.error = `Flat is already occupied by: ${this.getFlatOccupantName(this.currentResident.flatId)}`;
      return;
    }
    this.rs.createResident(this.currentResident).subscribe({
      next: () => {
        this.success = 'Resident registered successfully!';
        this.resetForm();
        this.loadResidents();
        this.loadFlats();
      },
      error: (err) => {
        this.error = err.error?.message || err.error || 'Failed to create resident.';
      }
    });
  }

  editResident(r: Resident): void {
    this.isEdit = true;
    this.success = '';
    this.error = '';
    this.currentResident = { ...r, flatId: r.flat ? r.flat.id : null };
  }

  updateResident(): void {
    if (!this.currentResident.id) return;
    if (this.currentResident.flatId && this.isFlatAllocatedToOther(this.currentResident.flatId)) {
      this.error = `Flat is already occupied by: ${this.getFlatOccupantName(this.currentResident.flatId)}`;
      return;
    }
    this.rs.updateResident(this.currentResident.id, this.currentResident).subscribe({
      next: () => {
        this.success = 'Resident updated successfully!';
        this.resetForm();
        this.loadResidents();
        this.loadFlats();
      },
      error: (err) => {
        this.error = err.error?.message || err.error || 'Failed to update resident.';
      }
    });
  }

  deleteResident(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this resident?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      confirmButtonColor: '#dc3545'
    }).then((res) => {
      if (res.isConfirmed) {
        this.rs.deleteResident(id).subscribe({
          next: () => {
            this.success = 'Resident removed successfully!';
            this.loadResidents();
            this.loadFlats();
          },
          error: (err) => {
            this.error = err.error?.message || err.error || 'Failed to delete resident.';
          }
        });
      }
    });
  }

  resetForm(): void {
    this.isEdit = false;
    this.currentResident = { name: '', email: '', phone: '', password: '', memberType: 'Owner', flatId: null, address: '', isActive: true };
    this.error = '';
  }
}
