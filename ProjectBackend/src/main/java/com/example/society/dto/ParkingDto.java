package com.example.society.dto;

public class ParkingDto {
    private Long id;
    private String parkingNumber;
    private Long flatId;
    private String flatDetails;
    private String vehicleNumber;
    private String status;

    public ParkingDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getParkingNumber() { return parkingNumber; }
    public void setParkingNumber(String parkingNumber) { this.parkingNumber = parkingNumber; }
    public Long getFlatId() { return flatId; }
    public void setFlatId(Long flatId) { this.flatId = flatId; }
    public String getFlatDetails() { return flatDetails; }
    public void setFlatDetails(String flatDetails) { this.flatDetails = flatDetails; }
    public String getVehicleNumber() { return vehicleNumber; }
    public void setVehicleNumber(String vehicleNumber) { this.vehicleNumber = vehicleNumber; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
