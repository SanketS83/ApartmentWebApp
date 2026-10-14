package com.example.society.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class MaintenanceDto {
    private Long id;
    private Long flatId;
    private String flatDetails;
    private Long residentId;
    private String residentName;
    private String month;
    private Integer year;
    private BigDecimal amount;
    private LocalDate dueDate;
    private String status;

    public MaintenanceDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getFlatId() { return flatId; }
    public void setFlatId(Long flatId) { this.flatId = flatId; }
    public String getFlatDetails() { return flatDetails; }
    public void setFlatDetails(String flatDetails) { this.flatDetails = flatDetails; }
    public Long getResidentId() { return residentId; }
    public void setResidentId(Long residentId) { this.residentId = residentId; }
    public String getResidentName() { return residentName; }
    public void setResidentName(String residentName) { this.residentName = residentName; }
    public String getMonth() { return month; }
    public void setMonth(String month) { this.month = month; }
    public void setMonth(Integer month) { this.month = month != null ? String.valueOf(month) : null; }
    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
