package com.example.society.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "parking")
public class Parking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "parking_number", length = 20, unique = true, nullable = false)
    private String parkingNumber;

    @ManyToOne
    @JoinColumn(name = "flat_id")
    private Flat flat;

    @Column(name = "vehicle_number", length = 30)
    private String vehicleNumber;

    @Column(length = 20, nullable = false)
    private String status = "Available";

    public Parking() { }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getParkingNumber() { return parkingNumber; }
    public void setParkingNumber(String parkingNumber) { this.parkingNumber = parkingNumber; }
    public Flat getFlat() { return flat; }
    public void setFlat(Flat flat) { this.flat = flat; }
    public String getVehicleNumber() { return vehicleNumber; }
    public void setVehicleNumber(String vehicleNumber) { this.vehicleNumber = vehicleNumber; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
