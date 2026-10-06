package com.example.society.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "flat")
public class Flat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "flat_number", length = 20, unique = true, nullable = false)
    private String flatNumber;

    @Column(length = 50, nullable = false)
    private String building;

    @Column(nullable = false)
    private Integer floor;

    @Column(name = "flat_type", length = 30, nullable = false)
    private String flatType = "2 BHK";

    @Column(nullable = false)
    private Integer area;

    @Column(length = 20, nullable = false)
    private String status = "Available";

    public Flat() { }

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

    @Override
    public String toString() {
        return building + "-" + flatNumber;
    }
}
