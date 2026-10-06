package com.example.society.service;

import com.example.society.entity.Visitor;
import com.example.society.entity.Resident;
import com.example.society.dto.VisitorDto;
import com.example.society.exception.ResourceNotFoundException;
import com.example.society.repository.VisitorRepository;
import com.example.society.repository.ResidentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class VisitorService {
    private final VisitorRepository visitorRepository;
    private final ResidentRepository residentRepository;

    public VisitorService(VisitorRepository visitorRepository, ResidentRepository residentRepository) {
        this.visitorRepository = visitorRepository;
        this.residentRepository = residentRepository;
    }

    public List<Visitor> getAllVisitors() {
        return visitorRepository.findAll();
    }

    public Visitor getVisitorById(Long id) {
        return visitorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Visitor not found with id: " + id));
    }

    public List<Visitor> getVisitorsByResidentId(Long residentId) {
        return visitorRepository.findByResidentId(residentId);
    }

    public Visitor createVisitor(VisitorDto dto) {
        Resident resident = residentRepository.findById(dto.getResidentId())
                .orElseThrow(() -> new ResourceNotFoundException("Resident not found with id: " + dto.getResidentId()));

        Visitor visitor = new Visitor();
        visitor.setResident(resident);
        visitor.setVisitorName(dto.getVisitorName());
        visitor.setPhone(dto.getPhone());
        visitor.setPurpose(dto.getPurpose());
        visitor.setVisitDate(dto.getVisitDate() != null ? dto.getVisitDate() : LocalDate.now());
        visitor.setCheckInTime(dto.getCheckInTime() != null ? dto.getCheckInTime() : LocalDateTime.now());
        visitor.setCheckOutTime(dto.getCheckOutTime());
        visitor.setStatus(dto.getStatus() != null ? dto.getStatus() : "Checked In");

        return visitorRepository.save(visitor);
    }

    public Visitor updateVisitor(Long id, VisitorDto dto) {
        Visitor visitor = getVisitorById(id);
        visitor.setVisitorName(dto.getVisitorName());
        visitor.setPhone(dto.getPhone());
        visitor.setPurpose(dto.getPurpose());
        if (dto.getVisitDate() != null) visitor.setVisitDate(dto.getVisitDate());
        if (dto.getCheckInTime() != null) visitor.setCheckInTime(dto.getCheckInTime());
        if (dto.getCheckOutTime() != null) visitor.setCheckOutTime(dto.getCheckOutTime());
        if (dto.getStatus() != null) visitor.setStatus(dto.getStatus());
        return visitorRepository.save(visitor);
    }

    public Visitor checkOutVisitor(Long id) {
        Visitor visitor = getVisitorById(id);
        visitor.setCheckOutTime(LocalDateTime.now());
        visitor.setStatus("Checked Out");
        return visitorRepository.save(visitor);
    }

    public void deleteVisitor(Long id) {
        Visitor visitor = getVisitorById(id);
        visitorRepository.delete(visitor);
    }
}
