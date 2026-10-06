package com.example.society.repository;

import com.example.society.entity.Maintenance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaintenanceRepository extends JpaRepository<Maintenance, Long> {
    List<Maintenance> findByResidentId(Long residentId);
    List<Maintenance> findByFlatId(Long flatId);
}
