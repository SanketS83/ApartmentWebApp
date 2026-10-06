package com.example.society.controller;

import com.example.society.entity.Guard;
import com.example.society.dto.GuardDto;
import com.example.society.dto.LoginRequest;
import com.example.society.dto.LoginResponse;
import com.example.society.exception.ErrorResponse;
import com.example.society.exception.ResourceNotFoundException;
import com.example.society.service.GuardService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/guards")
@CrossOrigin(origins = "http://localhost:4200")
public class GuardController {
    private final GuardService guardService;

    public GuardController(GuardService guardService) {
        this.guardService = guardService;
    }

    @GetMapping
    public ResponseEntity<List<Guard>> getAllGuards() {
        return ResponseEntity.ok(guardService.getAllGuards());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Guard> getGuardById(@PathVariable Long id) {
        return ResponseEntity.ok(guardService.getGuardById(id));
    }

    @PostMapping
    public ResponseEntity<Guard> createGuard(@RequestBody GuardDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(guardService.createGuard(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Guard> updateGuard(@PathVariable Long id, @RequestBody GuardDto dto) {
        return ResponseEntity.ok(guardService.updateGuard(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGuard(@PathVariable Long id) {
        guardService.deleteGuard(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Optional<Guard> guardOpt = guardService.login(loginRequest.getUsername(), loginRequest.getPassword());
        if (guardOpt.isPresent()) {
            Guard g = guardOpt.get();
            LoginResponse response = new LoginResponse(g.getId(), g.getName(), g.getUsername(), "GUARD", null, null);
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