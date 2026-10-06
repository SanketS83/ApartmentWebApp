package com.example.society.service;

import com.example.society.entity.Staff;
import com.example.society.exception.ResourceNotFoundException;
import com.example.society.repository.StaffRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StaffService {
    private final StaffRepository staffRepository;

    public StaffService(StaffRepository staffRepository) {
        this.staffRepository = staffRepository;
    }

    public List<Staff> getAllStaff() {
        return staffRepository.findAll();
    }

    public Staff getStaffById(Long id) {
        return staffRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found with id: " + id));
    }

    public Staff createStaff(Staff staff) {
        return staffRepository.save(staff);
    }

    public Staff updateStaff(Long id, Staff staffDetails) {
        Staff staff = getStaffById(id);
        staff.setName(staffDetails.getName());
        staff.setPhone(staffDetails.getPhone());
        staff.setDesignation(staffDetails.getDesignation());
        staff.setSalary(staffDetails.getSalary());
        staff.setJoiningDate(staffDetails.getJoiningDate());
        staff.setStatus(staffDetails.getStatus());
        return staffRepository.save(staff);
    }

    public void deleteStaff(Long id) {
        Staff staff = getStaffById(id);
        staffRepository.delete(staff);
    }
}
