package com.example.society.controller;

import com.example.society.entity.SocietyAdmin;
import com.example.society.dto.SocietyAdminDto;
import com.example.society.dto.LoginRequest;
import com.example.society.dto.LoginResponse;
import com.example.society.exception.ErrorResponse;
import com.example.society.exception.ResourceNotFoundException;
import com.example.society.service.SocietyAdminService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admins")
@CrossOrigin(origins = "http://localhost:4200")
public class SocietyAdminController {
    private final SocietyAdminService societyAdminService;

    public SocietyAdminController(SocietyAdminService societyAdminService) {
        this.societyAdminService = societyAdminService;
    }

    @GetMapping
    public ResponseEntity<List<SocietyAdmin>> getAllAdmins() {
        return ResponseEntity.ok(societyAdminService.getAllAdmins());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SocietyAdmin> getAdminById(@PathVariable Long id) {
        return ResponseEntity.ok(societyAdminService.getAdminById(id));
    }

    @PostMapping
    public ResponseEntity<SocietyAdmin> createAdmin(@RequestBody SocietyAdminDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(societyAdminService.createAdmin(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SocietyAdmin> updateAdmin(@PathVariable Long id, @RequestBody SocietyAdminDto dto) {
        return ResponseEntity.ok(societyAdminService.updateAdmin(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAdmin(@PathVariable Long id) {
        societyAdminService.deleteAdmin(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Optional<SocietyAdmin> adminOpt = societyAdminService.login(loginRequest.getUsername(), loginRequest.getPassword());
        if (adminOpt.isPresent()) {
            SocietyAdmin a = adminOpt.get();
            LoginResponse response = new LoginResponse(a.getId(), a.getName(), a.getUsername(), "ADMIN", a.getEmail(), null);
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials or account inactive");
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex, HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponse(404, "Not Found", ex.getMessage(), request.getRequestURI()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneric(Exception ex, HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse(500, "Internal Server Error", ex.getMessage(), request.getRequestURI()));
    }
}