package com.example.society.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "maintenance_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Maintenance maintenance;

    @ManyToOne
    @JoinColumn(name = "resident_id", nullable = false)
    @JsonIgnoreProperties({"password", "hibernateLazyInitializer", "handler"})
    private Resident resident;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(name = "payment_date", nullable = false)
    private LocalDate paymentDate;

    @Column(name = "payment_time")
    private LocalDateTime paymentTime;

    @Column(name = "payment_mode", length = 30)
    private String paymentMode = "Cash";

    @Column(name = "payment_method", length = 50)
    private String paymentMethod = "Cash";

    @Column(name = "transaction_id", length = 150)
    private String transactionId;

    @Column(name = "transaction_ref", length = 150)
    private String transactionRef;

    private Double gstPercent;
    private Double discountPercent;
    private Double gstAmount;
    private Double discountAmount;
    private Double totalAmount;
    private Double netAmount;

    @Column(length = 30, nullable = false)
    private String status = "Pending";

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @PrePersist
    protected void onCreate() {
        if (paymentDate == null) {
            paymentDate = LocalDate.now();
        }
        if (paymentTime == null) {
            paymentTime = LocalDateTime.now();
        }
        if (amount != null && totalAmount == null) {
            totalAmount = amount.doubleValue();
        }
        if (amount != null && netAmount == null) {
            netAmount = amount.doubleValue();
        }
        if (paymentMethod != null && paymentMode == null) {
            paymentMode = paymentMethod;
        } else if (paymentMode != null && paymentMethod == null) {
            paymentMethod = paymentMode;
        }
    }

    public Payment() { }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Maintenance getMaintenance() { return maintenance; }
    public void setMaintenance(Maintenance maintenance) { this.maintenance = maintenance; }

    public Resident getResident() { return resident; }
    public void setResident(Resident resident) { this.resident = resident; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) {
        this.amount = amount;
        if (amount != null) {
            if (this.totalAmount == null) this.totalAmount = amount.doubleValue();
            if (this.netAmount == null) this.netAmount = amount.doubleValue();
        }
    }

    public LocalDate getPaymentDate() { return paymentDate; }
    public void setPaymentDate(LocalDate paymentDate) { this.paymentDate = paymentDate; }

    public LocalDateTime getPaymentTime() { return paymentTime; }
    public void setPaymentTime(LocalDateTime paymentTime) { this.paymentTime = paymentTime; }

    public String getPaymentMode() { return paymentMode; }
    public void setPaymentMode(String paymentMode) {
        this.paymentMode = paymentMode;
        if (this.paymentMethod == null) this.paymentMethod = paymentMode;
    }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
        if (this.paymentMode == null) this.paymentMode = paymentMethod;
    }

    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
        if (this.transactionRef == null) this.transactionRef = transactionId;
    }

    public String getTransactionRef() { return transactionRef; }
    public void setTransactionRef(String transactionRef) {
        this.transactionRef = transactionRef;
        if (this.transactionId == null) this.transactionId = transactionRef;
    }

    public Double getGstPercent() { return gstPercent; }
    public void setGstPercent(Double gstPercent) { this.gstPercent = gstPercent; }

    public Double getDiscountPercent() { return discountPercent; }
    public void setDiscountPercent(Double discountPercent) { this.discountPercent = discountPercent; }

    public Double getGstAmount() { return gstAmount; }
    public void setGstAmount(Double gstAmount) { this.gstAmount = gstAmount; }

    public Double getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(Double discountAmount) { this.discountAmount = discountAmount; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
        if (this.amount == null && totalAmount != null) {
            this.amount = BigDecimal.valueOf(totalAmount);
        }
    }

    public Double getNetAmount() { return netAmount; }
    public void setNetAmount(Double netAmount) {
        this.netAmount = netAmount;
        if (this.amount == null && netAmount != null) {
            this.amount = BigDecimal.valueOf(netAmount);
        }
    }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
