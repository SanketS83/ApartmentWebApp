package com.example.society.service;

import com.example.society.entity.Resident;
import com.example.society.entity.Flat;
import com.example.society.dto.ResidentDto;
import com.example.society.exception.ResourceNotFoundException;
import com.example.society.repository.ResidentRepository;
import com.example.society.repository.FlatRepository;
import com.example.society.util.PasswordUtil;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ResidentService {
    private final ResidentRepository residentRepository;
    private final FlatRepository flatRepository;

    public ResidentService(ResidentRepository residentRepository, FlatRepository flatRepository) {
        this.residentRepository = residentRepository;
        this.flatRepository = flatRepository;
    }

    public List<Resident> getAllResidents() {
        return residentRepository.findAll();
    }

    public Resident getResidentById(Long id) {
        return residentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resident not found with id: " + id));
    }

    public Resident createResident(ResidentDto dto) {
        Resident resident = new Resident();
        resident.setName(dto.getName());
        resident.setEmail(dto.getEmail());
        resident.setPhone(dto.getPhone());
        resident.setPassword(PasswordUtil.hashPassword(dto.getPassword()));
        resident.setMemberType(dto.getMemberType() != null ? dto.getMemberType() : "Owner");
        resident.setAddress(dto.getAddress());
        resident.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);

        if (dto.getFlatId() != null) {
            List<Resident> existing = residentRepository.findByFlatId(dto.getFlatId());
            if (!existing.isEmpty()) {
                throw new IllegalArgumentException("Flat is already allocated to resident: " + existing.get(0).getName());
            }
            Flat flat = flatRepository.findById(dto.getFlatId())
                    .orElseThrow(() -> new ResourceNotFoundException("Flat not found with id: " + dto.getFlatId()));
            resident.setFlat(flat);
            flat.setStatus("Occupied");
            flatRepository.save(flat);
        }

        return residentRepository.save(resident);
    }

    public Resident updateResident(Long id, ResidentDto dto) {
        Resident resident = getResidentById(id);
        resident.setName(dto.getName());
        resident.setEmail(dto.getEmail());
        resident.setPhone(dto.getPhone());
        if (dto.getPassword() != null && !dto.getPassword().trim().isEmpty()) {
            resident.setPassword(PasswordUtil.hashPassword(dto.getPassword()));
        }
        if (dto.getMemberType() != null) {
            resident.setMemberType(dto.getMemberType());
        }
        resident.setAddress(dto.getAddress());
        if (dto.getIsActive() != null) {
            resident.setIsActive(dto.getIsActive());
        }

        Flat oldFlat = resident.getFlat();
        Long newFlatId = dto.getFlatId();

        if (newFlatId != null && (oldFlat == null || !oldFlat.getId().equals(newFlatId))) {
            List<Resident> existing = residentRepository.findByFlatId(newFlatId);
            for (Resident other : existing) {
                if (!other.getId().equals(id)) {
                    throw new IllegalArgumentException("Flat is already allocated to resident: " + other.getName());
                }
            }
            Flat newFlat = flatRepository.findById(newFlatId)
                    .orElseThrow(() -> new ResourceNotFoundException("Flat not found with id: " + newFlatId));
            resident.setFlat(newFlat);
            newFlat.setStatus("Occupied");
            flatRepository.save(newFlat);

            if (oldFlat != null) {
                oldFlat.setStatus("Available");
                flatRepository.save(oldFlat);
            }
        }

        return residentRepository.save(resident);
    }

    public void deleteResident(Long id) {
        Resident resident = getResidentById(id);
        if (resident.getFlat() != null) {
            Flat flat = resident.getFlat();
            flat.setStatus("Available");
            flatRepository.save(flat);
        }
        residentRepository.delete(resident);
    }

    public Optional<Resident> login(String email, String password) {
        Optional<Resident> residentOpt = residentRepository.findByEmail(email);
        if (residentOpt.isPresent()) {
            Resident resident = residentOpt.get();
            if (PasswordUtil.checkPassword(password, resident.getPassword()) && Boolean.TRUE.equals(resident.getIsActive())) {
                return Optional.of(resident);
            }
        }
        return Optional.empty();
    }
}
