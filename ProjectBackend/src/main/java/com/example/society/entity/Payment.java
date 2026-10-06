package com.example.society.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "payment")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "maintenance_id", nullable = false)
    private Maintenance maintenance;

    @ManyToOne
    @JoinColumn(name = "resident_id", nullable = false)
    private Resident resident;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(name = "payment_date", nullable = false)
    private LocalDate paymentDate;

    @Column(name = "payment_mode", length = 30, nullable = false)
    private String paymentMode;

    @Column(name = "transaction_id", length = 100)
    private String transactionId;

    @Column(length = 20, nullable = false)
    private String status = "Pending";

    @PrePersist
    protected void onCreate() {
        if (paymentDate == null) {
            paymentDate = LocalDate.now();
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
