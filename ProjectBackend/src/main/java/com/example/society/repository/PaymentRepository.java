package com.example.society.repository;

import com.example.society.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByResidentId(Long residentId);
    List<Payment> findByMaintenanceId(Long maintenanceId);
    Optional<Payment> findByMaintenance_Id(Long maintenanceId);
    Payment findByTransactionRef(String transactionRef);
    Payment findByTransactionId(String transactionId);
    List<Payment> findByStatus(String status);
}
