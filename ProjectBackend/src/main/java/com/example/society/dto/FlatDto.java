package com.example.society.dto;

public class FlatDto {
    private Long id;
    private String flatNumber;
    private String building;
    private Integer floor;
    private String flatType;
    private Integer area;
    private String status;

    public FlatDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getFlatNumber() { return flatNumber; }
    public void setFlatNumber(String flatNumber) { this.flatNumber = flatNumber; }
    public String getBuilding() { return building; }
    public void setBuilding(String building) { this.building = building; }
    public Integer getFloor() { return floor; }
    public void setFloor(Integer floor) { this.floor = floor; }
    public String getFlatType() { return flatType; }
    public void setFlatType(String flatType) { this.flatType = flatType; }
    public Integer getArea() { return area; }
    public void setArea(Integer area) { this.area = area; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
