package com.example.society.service;

import com.example.society.entity.Maintenance;
import com.example.society.entity.Flat;
import com.example.society.entity.Resident;
import com.example.society.dto.MaintenanceDto;
import com.example.society.exception.ResourceNotFoundException;
import com.example.society.repository.MaintenanceRepository;
import com.example.society.repository.FlatRepository;
import com.example.society.repository.ResidentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class MaintenanceService {
    private final MaintenanceRepository maintenanceRepository;
    private final FlatRepository flatRepository;
    private final ResidentRepository residentRepository;

    public MaintenanceService(MaintenanceRepository maintenanceRepository,
                              FlatRepository flatRepository,
                              ResidentRepository residentRepository) {
        this.maintenanceRepository = maintenanceRepository;
        this.flatRepository = flatRepository;
        this.residentRepository = residentRepository;
    }

    public List<Maintenance> getAllMaintenance() {
        return maintenanceRepository.findAll();
    }

    public Maintenance getMaintenanceById(Long id) {
        return maintenanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Maintenance not found with id: " + id));
    }

    public List<Maintenance> getMaintenanceByResidentId(Long residentId) {
        return maintenanceRepository.findByResidentId(residentId);
    }

    public Maintenance createMaintenance(MaintenanceDto dto) {
        Flat flat = flatRepository.findById(dto.getFlatId())
                .orElseThrow(() -> new ResourceNotFoundException("Flat not found with id: " + dto.getFlatId()));

        Resident resident = null;
        if (dto.getResidentId() != null) {
            resident = residentRepository.findById(dto.getResidentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Resident not found with id: " + dto.getResidentId()));
        } else {
            List<Resident> residentsInFlat = residentRepository.findByFlatId(flat.getId());
            if (!residentsInFlat.isEmpty()) {
                resident = residentsInFlat.get(0);
            } else {
                throw new IllegalArgumentException("No resident is currently assigned to Flat " + flat.getBuilding() + " - " + flat.getFlatNumber() + ". Please allocate a resident first.");
            }
        }

        Maintenance maintenance = new Maintenance();
        maintenance.setFlat(flat);
        maintenance.setResident(resident);
        maintenance.setMonth(dto.getMonth() != null ? String.valueOf(dto.getMonth()) : "1");
        maintenance.setYear(dto.getYear() != null ? dto.getYear() : LocalDate.now().getYear());
        maintenance.setAmount(dto.getAmount());
        maintenance.setDueDate(dto.getDueDate() != null ? dto.getDueDate() : LocalDate.now().plusDays(15));
        maintenance.setStatus(dto.getStatus() != null ? dto.getStatus() : "Pending");

        return maintenanceRepository.save(maintenance);
    }

    public Maintenance updateMaintenance(Long id, MaintenanceDto dto) {
        Maintenance maintenance = getMaintenanceById(id);
        if (dto.getFlatId() != null) {
            Flat flat = flatRepository.findById(dto.getFlatId())
                    .orElseThrow(() -> new ResourceNotFoundException("Flat not found with id: " + dto.getFlatId()));
            maintenance.setFlat(flat);
        }
        if (dto.getResidentId() != null) {
            Resident resident = residentRepository.findById(dto.getResidentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Resident not found with id: " + dto.getResidentId()));
            maintenance.setResident(resident);
        }
        maintenance.setMonth(dto.getMonth());
        maintenance.setYear(dto.getYear());
        maintenance.setAmount(dto.getAmount());
        maintenance.setDueDate(dto.getDueDate());
        if (dto.getStatus() != null) {
            maintenance.setStatus(dto.getStatus());
        }
        return maintenanceRepository.save(maintenance);
    }

    public void deleteMaintenance(Long id) {
        Maintenance maintenance = getMaintenanceById(id);
        maintenanceRepository.delete(maintenance);
    }
}
