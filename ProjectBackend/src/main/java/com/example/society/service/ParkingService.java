package com.example.society.service;

import com.example.society.entity.Parking;
import com.example.society.entity.Flat;
import com.example.society.dto.ParkingDto;
import com.example.society.exception.ResourceNotFoundException;
import com.example.society.repository.ParkingRepository;
import com.example.society.repository.FlatRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ParkingService {
    private final ParkingRepository parkingRepository;
    private final FlatRepository flatRepository;

    public ParkingService(ParkingRepository parkingRepository, FlatRepository flatRepository) {
        this.parkingRepository = parkingRepository;
        this.flatRepository = flatRepository;
    }

    public List<Parking> getAllParking() {
        return parkingRepository.findAll();
    }

    public Parking getParkingById(Long id) {
        return parkingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Parking not found with id: " + id));
    }

    public List<Parking> getParkingByFlatId(Long flatId) {
        return parkingRepository.findByFlatId(flatId);
    }

    public Parking createParking(ParkingDto dto) {
        Parking parking = new Parking();
        parking.setParkingNumber(dto.getParkingNumber());
        parking.setVehicleNumber(dto.getVehicleNumber());
        parking.setStatus(dto.getStatus() != null ? dto.getStatus() : "Available");

        if (dto.getFlatId() != null) {
            Flat flat = flatRepository.findById(dto.getFlatId())
                    .orElseThrow(() -> new ResourceNotFoundException("Flat not found with id: " + dto.getFlatId()));
            parking.setFlat(flat);
        }

        return parkingRepository.save(parking);
    }

    public Parking updateParking(Long id, ParkingDto dto) {
        Parking parking = getParkingById(id);
        parking.setParkingNumber(dto.getParkingNumber());
        parking.setVehicleNumber(dto.getVehicleNumber());
        parking.setStatus(dto.getStatus());
        if (dto.getFlatId() != null) {
            Flat flat = flatRepository.findById(dto.getFlatId())
                    .orElseThrow(() -> new ResourceNotFoundException("Flat not found with id: " + dto.getFlatId()));
            parking.setFlat(flat);
        } else {
            parking.setFlat(null);
        }
        return parkingRepository.save(parking);
    }

    public void deleteParking(Long id) {
        Parking parking = getParkingById(id);
        parkingRepository.delete(parking);
    }
}
