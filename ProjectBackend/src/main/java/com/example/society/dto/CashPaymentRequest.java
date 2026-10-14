package com.example.society.dto;

public class CashPaymentRequest {
    private Long maintenanceId;
    private Long residentId;
    private String remarks;

    public CashPaymentRequest() {}

    public CashPaymentRequest(Long maintenanceId, Long residentId, String remarks) {
        this.maintenanceId = maintenanceId;
        this.residentId = residentId;
        this.remarks = remarks;
    }

    public Long getMaintenanceId() { return maintenanceId; }
    public void setMaintenanceId(Long maintenanceId) { this.maintenanceId = maintenanceId; }

    public Long getResidentId() { return residentId; }
    public void setResidentId(Long residentId) { this.residentId = residentId; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
