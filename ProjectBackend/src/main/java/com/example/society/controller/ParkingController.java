package com.example.society.controller;

import com.example.society.entity.Parking;
import com.example.society.dto.ParkingDto;
import com.example.society.exception.ErrorResponse;
import com.example.society.exception.ResourceNotFoundException;
import com.example.society.service.ParkingService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/parking")
@CrossOrigin(origins = "http://localhost:4200")
public class ParkingController {
    private final ParkingService parkingService;

    public ParkingController(ParkingService parkingService) {
        this.parkingService = parkingService;
    }

    @GetMapping
    public ResponseEntity<List<Parking>> getAllParking() {
        return ResponseEntity.ok(parkingService.getAllParking());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Parking> getParkingById(@PathVariable Long id) {
        return ResponseEntity.ok(parkingService.getParkingById(id));
    }

    @GetMapping("/flat/{flatId}")
    public ResponseEntity<List<Parking>> getParkingByFlatId(@PathVariable Long flatId) {
        return ResponseEntity.ok(parkingService.getParkingByFlatId(flatId));
    }

    @PostMapping
    public ResponseEntity<Parking> createParking(@RequestBody ParkingDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(parkingService.createParking(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Parking> updateParking(@PathVariable Long id, @RequestBody ParkingDto dto) {
        return ResponseEntity.ok(parkingService.updateParking(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteParking(@PathVariable Long id) {
        parkingService.deleteParking(id);
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