package com.example.society.service;

import com.example.society.entity.Payment;
import com.example.society.entity.Maintenance;
import com.example.society.entity.Resident;
import com.example.society.dto.PaymentDto;
import com.example.society.exception.ResourceNotFoundException;
import com.example.society.repository.PaymentRepository;
import com.example.society.repository.MaintenanceRepository;
import com.example.society.repository.ResidentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final MaintenanceRepository maintenanceRepository;
    private final ResidentRepository residentRepository;

    public PaymentService(PaymentRepository paymentRepository,
                          MaintenanceRepository maintenanceRepository,
                          ResidentRepository residentRepository) {
        this.paymentRepository = paymentRepository;
        this.maintenanceRepository = maintenanceRepository;
        this.residentRepository = residentRepository;
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public Payment getPaymentById(Long id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + id));
    }

    public List<Payment> getPaymentsByResidentId(Long residentId) {
        return paymentRepository.findByResidentId(residentId);
    }

    public Payment createPayment(PaymentDto dto) {
        Maintenance maintenance = maintenanceRepository.findById(dto.getMaintenanceId())
                .orElseThrow(() -> new ResourceNotFoundException("Maintenance not found with id: " + dto.getMaintenanceId()));
        Resident resident = residentRepository.findById(dto.getResidentId())
                .orElseThrow(() -> new ResourceNotFoundException("Resident not found with id: " + dto.getResidentId()));

        Payment payment = new Payment();
        payment.setMaintenance(maintenance);
        payment.setResident(resident);
        payment.setAmount(dto.getAmount());
        payment.setPaymentDate(dto.getPaymentDate());
        payment.setPaymentMode(dto.getPaymentMode());
        payment.setTransactionId(dto.getTransactionId());
        payment.setStatus(dto.getStatus() != null ? dto.getStatus() : "Success");

        // Update maintenance status if paid
        if ("Success".equalsIgnoreCase(payment.getStatus()) || "Paid".equalsIgnoreCase(payment.getStatus())) {
            maintenance.setStatus("Paid");
            maintenanceRepository.save(maintenance);
        }

        return paymentRepository.save(payment);
    }

    public Payment updatePayment(Long id, PaymentDto dto) {
        Payment payment = getPaymentById(id);
        payment.setAmount(dto.getAmount());
        payment.setPaymentDate(dto.getPaymentDate());
        payment.setPaymentMode(dto.getPaymentMode());
        payment.setTransactionId(dto.getTransactionId());
        if (dto.getStatus() != null) {
            payment.setStatus(dto.getStatus());
        }
        return paymentRepository.save(payment);
    }

    public void deletePayment(Long id) {
        Payment payment = getPaymentById(id);
        paymentRepository.delete(payment);
    }
}
