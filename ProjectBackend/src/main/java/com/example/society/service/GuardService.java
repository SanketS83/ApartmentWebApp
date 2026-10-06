package com.example.society.service;

import com.example.society.entity.Guard;
import com.example.society.dto.GuardDto;
import com.example.society.exception.ResourceNotFoundException;
import com.example.society.repository.GuardRepository;
import com.example.society.util.PasswordUtil;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GuardService {
    private final GuardRepository guardRepository;

    public GuardService(GuardRepository guardRepository) {
        this.guardRepository = guardRepository;
    }

    public List<Guard> getAllGuards() {
        return guardRepository.findAll();
    }

    public Guard getGuardById(Long id) {
        return guardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Guard not found with id: " + id));
    }

    public Guard createGuard(GuardDto dto) {
        Guard guard = new Guard();
        guard.setName(dto.getName());
        guard.setUsername(dto.getUsername());
        guard.setPhone(dto.getPhone());
        guard.setPassword(PasswordUtil.hashPassword(dto.getPassword()));
        guard.setShift(dto.getShift() != null ? dto.getShift() : "Day");
        guard.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);
        return guardRepository.save(guard);
    }

    public Guard updateGuard(Long id, GuardDto dto) {
        Guard guard = getGuardById(id);
        guard.setName(dto.getName());
        guard.setUsername(dto.getUsername());
        guard.setPhone(dto.getPhone());
        if (dto.getPassword() != null && !dto.getPassword().trim().isEmpty()) {
            guard.setPassword(PasswordUtil.hashPassword(dto.getPassword()));
        }
        if (dto.getShift() != null) {
            guard.setShift(dto.getShift());
        }
        if (dto.getIsActive() != null) {
            guard.setIsActive(dto.getIsActive());
        }
        return guardRepository.save(guard);
    }

    public void deleteGuard(Long id) {
        Guard guard = getGuardById(id);
        guardRepository.delete(guard);
    }

    public Optional<Guard> login(String username, String password) {
        Optional<Guard> guardOpt = guardRepository.findByUsername(username);
        if (guardOpt.isPresent()) {
            Guard guard = guardOpt.get();
            if (PasswordUtil.checkPassword(password, guard.getPassword()) && Boolean.TRUE.equals(guard.getIsActive())) {
                return Optional.of(guard);
            }
        }
        return Optional.empty();
    }
}
