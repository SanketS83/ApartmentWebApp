package com.example.society.controller;

import com.example.society.entity.Visitor;
import com.example.society.dto.VisitorDto;
import com.example.society.exception.ErrorResponse;
import com.example.society.exception.ResourceNotFoundException;
import com.example.society.service.VisitorService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/visitors")
@CrossOrigin(origins = "http://localhost:4200")
public class VisitorController {
    private final VisitorService visitorService;

    public VisitorController(VisitorService visitorService) {
        this.visitorService = visitorService;
    }

    @GetMapping
    public ResponseEntity<List<Visitor>> getAllVisitors() {
        return ResponseEntity.ok(visitorService.getAllVisitors());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Visitor> getVisitorById(@PathVariable Long id) {
        return ResponseEntity.ok(visitorService.getVisitorById(id));
    }

    @GetMapping("/resident/{residentId}")
    public ResponseEntity<List<Visitor>> getVisitorsByResidentId(@PathVariable Long residentId) {
        return ResponseEntity.ok(visitorService.getVisitorsByResidentId(residentId));
    }

    @PostMapping
    public ResponseEntity<Visitor> createVisitor(@RequestBody VisitorDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(visitorService.createVisitor(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Visitor> updateVisitor(@PathVariable Long id, @RequestBody VisitorDto dto) {
        return ResponseEntity.ok(visitorService.updateVisitor(id, dto));
    }

    @PutMapping("/{id}/checkout")
    public ResponseEntity<Visitor> checkOutVisitor(@PathVariable Long id) {
        return ResponseEntity.ok(visitorService.checkOutVisitor(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVisitor(@PathVariable Long id) {
        visitorService.deleteVisitor(id);
        return ResponseEntity.noContent().build();
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