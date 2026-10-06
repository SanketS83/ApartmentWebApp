package com.example.society.repository;

import com.example.society.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByResidentId(Long residentId);
    List<Payment> findByMaintenanceId(Long maintenanceId);
}
