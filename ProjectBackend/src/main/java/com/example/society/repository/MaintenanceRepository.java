package com.example.society.repository;

import com.example.society.entity.Maintenance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MaintenanceRepository extends JpaRepository<Maintenance, Long> {
    List<Maintenance> findByResidentId(Long residentId);
    List<Maintenance> findByFlatId(Long flatId);
    Optional<Maintenance> findByFlatIdAndMonthIgnoreCaseAndYear(Long flatId, String month, Integer year);
    Optional<Maintenance> findByResidentIdAndMonthIgnoreCaseAndYear(Long residentId, String month, Integer year);
}
