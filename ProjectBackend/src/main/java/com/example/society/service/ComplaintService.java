package com.example.society.service;

import com.example.society.entity.Complaint;
import com.example.society.entity.Resident;
import com.example.society.dto.ComplaintDto;
import com.example.society.exception.ResourceNotFoundException;
import com.example.society.repository.ComplaintRepository;
import com.example.society.repository.ResidentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ComplaintService {
    private final ComplaintRepository complaintRepository;
    private final ResidentRepository residentRepository;

    public ComplaintService(ComplaintRepository complaintRepository, ResidentRepository residentRepository) {
        this.complaintRepository = complaintRepository;
        this.residentRepository = residentRepository;
    }

    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    public Complaint getComplaintById(Long id) {
        return complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with id: " + id));
    }

    public List<Complaint> getComplaintsByResidentId(Long residentId) {
        return complaintRepository.findByResidentId(residentId);
    }

    public Complaint createComplaint(ComplaintDto dto) {
        Resident resident = residentRepository.findById(dto.getResidentId())
                .orElseThrow(() -> new ResourceNotFoundException("Resident not found with id: " + dto.getResidentId()));

        Complaint complaint = new Complaint();
        complaint.setResident(resident);
        complaint.setSubject(dto.getSubject());
        complaint.setDescription(dto.getDescription());
        complaint.setCategory(dto.getCategory());
        complaint.setPriority(dto.getPriority() != null ? dto.getPriority() : "Medium");
        complaint.setStatus("Pending");

        return complaintRepository.save(complaint);
    }

    public Complaint updateComplaint(Long id, ComplaintDto dto) {
        Complaint complaint = getComplaintById(id);
        if (dto.getSubject() != null) complaint.setSubject(dto.getSubject());
        if (dto.getDescription() != null) complaint.setDescription(dto.getDescription());
        if (dto.getCategory() != null) complaint.setCategory(dto.getCategory());
        if (dto.getPriority() != null) complaint.setPriority(dto.getPriority());
        if (dto.getStatus() != null) complaint.setStatus(dto.getStatus());
        if (dto.getAdminReply() != null) complaint.setAdminReply(dto.getAdminReply());
        return complaintRepository.save(complaint);
    }

    public void deleteComplaint(Long id) {
        Complaint complaint = getComplaintById(id);
        complaintRepository.delete(complaint);
    }
}
