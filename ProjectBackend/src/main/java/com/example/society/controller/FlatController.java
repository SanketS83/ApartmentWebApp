package com.example.society.controller;

import com.example.society.entity.Flat;
import com.example.society.exception.ErrorResponse;
import com.example.society.exception.ResourceNotFoundException;
import com.example.society.service.FlatService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flats")
@CrossOrigin(origins = "http://localhost:4200")
public class FlatController {
    private final FlatService flatService;

    public FlatController(FlatService flatService) {
        this.flatService = flatService;
    }

    @GetMapping
    public ResponseEntity<List<Flat>> getAllFlats() {
        return ResponseEntity.ok(flatService.getAllFlats());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Flat> getFlatById(@PathVariable Long id) {
        return ResponseEntity.ok(flatService.getFlatById(id));
    }

    @PostMapping
    public ResponseEntity<Flat> createFlat(@RequestBody Flat flat) {
        return ResponseEntity.ok(flatService.createFlat(flat));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Flat> updateFlat(@PathVariable Long id, @RequestBody Flat flat) {
        return ResponseEntity.ok(flatService.updateFlat(id, flat));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFlat(@PathVariable Long id) {
        flatService.deleteFlat(id);
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