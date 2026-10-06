package com.example.society.service;

import com.example.society.entity.SocietyAdmin;
import com.example.society.dto.SocietyAdminDto;
import com.example.society.exception.ResourceNotFoundException;
import com.example.society.repository.SocietyAdminRepository;
import com.example.society.util.PasswordUtil;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SocietyAdminService {
    private final SocietyAdminRepository societyAdminRepository;

    public SocietyAdminService(SocietyAdminRepository societyAdminRepository) {
        this.societyAdminRepository = societyAdminRepository;
    }

    public List<SocietyAdmin> getAllAdmins() {
        return societyAdminRepository.findAll();
    }

    public SocietyAdmin getAdminById(Long id) {
        return societyAdminRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with id: " + id));
    }

    public SocietyAdmin createAdmin(SocietyAdminDto dto) {
        SocietyAdmin admin = new SocietyAdmin();
        admin.setName(dto.getName());
        admin.setUsername(dto.getUsername());
        admin.setEmail(dto.getEmail());
        admin.setPhone(dto.getPhone());
        admin.setPassword(PasswordUtil.hashPassword(dto.getPassword()));
        admin.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);
        return societyAdminRepository.save(admin);
    }

    public SocietyAdmin updateAdmin(Long id, SocietyAdminDto dto) {
        SocietyAdmin admin = getAdminById(id);
        admin.setName(dto.getName());
        admin.setUsername(dto.getUsername());
        admin.setEmail(dto.getEmail());
        admin.setPhone(dto.getPhone());
        if (dto.getPassword() != null && !dto.getPassword().trim().isEmpty()) {
            admin.setPassword(PasswordUtil.hashPassword(dto.getPassword()));
        }
        if (dto.getIsActive() != null) {
            admin.setIsActive(dto.getIsActive());
        }
        return societyAdminRepository.save(admin);
    }

    public void deleteAdmin(Long id) {
        SocietyAdmin admin = getAdminById(id);
        societyAdminRepository.delete(admin);
    }

    public Optional<SocietyAdmin> login(String username, String password) {
        Optional<SocietyAdmin> adminOpt = societyAdminRepository.findByUsername(username);
        if (adminOpt.isPresent()) {
            SocietyAdmin admin = adminOpt.get();
            if (PasswordUtil.checkPassword(password, admin.getPassword()) && Boolean.TRUE.equals(admin.getIsActive())) {
                return Optional.of(admin);
            }
        }
        return Optional.empty();
    }
}
