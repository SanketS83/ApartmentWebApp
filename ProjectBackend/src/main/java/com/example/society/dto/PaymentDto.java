package com.example.society.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class PaymentDto {
    private Long id;
    private Long maintenanceId;
    private Long residentId;
    private String residentName;
    private BigDecimal amount;
    private LocalDate paymentDate;
    private String paymentMode;
    private String transactionId;
    private String status;

    public PaymentDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getMaintenanceId() { return maintenanceId; }
    public void setMaintenanceId(Long maintenanceId) { this.maintenanceId = maintenanceId; }
    public Long getResidentId() { return residentId; }
    public void setResidentId(Long residentId) { this.residentId = residentId; }
    public String getResidentName() { return residentName; }
    public void setResidentName(String residentName) { this.residentName = residentName; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public LocalDate getPaymentDate() { return paymentDate; }
    public void setPaymentDate(LocalDate paymentDate) { this.paymentDate = paymentDate; }
    public String getPaymentMode() { return paymentMode; }
    public void setPaymentMode(String paymentMode) { this.paymentMode = paymentMode; }
    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
