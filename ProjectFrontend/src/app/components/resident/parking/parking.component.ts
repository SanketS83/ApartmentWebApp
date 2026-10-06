import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParkingService } from '../../../services/parking.service';
import { Parking } from '../../../models/parking.model';
@Component({ selector: 'app-res-park-page', standalone: true, imports: [CommonModule], templateUrl: './parking.component.html', styleUrl: './parking.component.css' })
export class ParkingComponent implements OnInit {
  parkingList: Parking[] = [];
  constructor(private ps: ParkingService) {}
  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (user.flatId) this.ps.getParkingByFlat(user.flatId).subscribe(d => this.parkingList = d);
  }
}