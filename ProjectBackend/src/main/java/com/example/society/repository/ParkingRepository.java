package com.example.society.repository;

import com.example.society.entity.Parking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ParkingRepository extends JpaRepository<Parking, Long> {
    List<Parking> findByFlatId(Long flatId);
    Optional<Parking> findByParkingNumber(String parkingNumber);
}
