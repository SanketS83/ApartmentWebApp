package com.example.society.controller;

import com.example.society.dto.CashPaymentRequest;
import com.example.society.dto.PaymentDto;
import com.example.society.entity.Payment;
import com.example.society.exception.ErrorResponse;
import com.example.society.exception.ResourceNotFoundException;
import com.example.society.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:4200")
public class PaymentController {
    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Payment> getPaymentById(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.getPaymentById(id));
    }

    @GetMapping("/resident/{residentId}")
    public ResponseEntity<List<Payment>> getPaymentsByResidentId(@PathVariable Long residentId) {
        return ResponseEntity.ok(paymentService.getPaymentsByResidentId(residentId));
    }

    @GetMapping("/maintenance/{maintenanceId}")
    public ResponseEntity<List<Payment>> getPaymentsByMaintenanceId(@PathVariable Long maintenanceId) {
        return ResponseEntity.ok(paymentService.getPaymentsByMaintenanceId(maintenanceId));
    }

    // =====================================
    // 1. STRIPE GATEWAY: CREATE SESSION
    // =====================================
    @PostMapping("/stripe/create-session/{maintenanceId}")
    public ResponseEntity<?> createStripeSession(@PathVariable Long maintenanceId) {
        try {
            Map<String, String> res = paymentService.createStripeSession(maintenanceId);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // =====================================
    // 2. STRIPE GATEWAY: CONFIRM PAYMENT
    // =====================================
    @PostMapping("/stripe/confirm")
    public ResponseEntity<?> confirmPayment(@RequestParam String sessionId) {
        try {
            Object res = paymentService.confirmPayment(sessionId);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // =====================================
    // 3. CASH PAYMENT: RESIDENT SUBMISSION
    // =====================================
    @PostMapping("/cash/record")
    public ResponseEntity<?> recordCashPayment(@RequestBody CashPaymentRequest request) {
        try {
            Payment payment = paymentService.recordCashPayment(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(payment);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // =====================================
    // 4. CASH PAYMENT: ADMIN APPROVAL
    // =====================================
    @PostMapping("/{id}/approve-cash")
    public ResponseEntity<?> approveCashPayment(@PathVariable Long id) {
        try {
            Payment payment = paymentService.approveCashPayment(id);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // =====================================
    // 5. CASH PAYMENT: ADMIN REJECTION
    // =====================================
    @PostMapping("/{id}/reject-cash")
    public ResponseEntity<?> rejectCashPayment(@PathVariable Long id, @RequestParam(required = false) String reason) {
        try {
            Payment payment = paymentService.rejectCashPayment(id, reason);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // =====================================
    // 6. DIRECT CASH APPROVAL VIA MAINTENANCE ID
    // =====================================
    @PostMapping("/maintenance/{maintenanceId}/approve-cash")
    public ResponseEntity<?> approveMaintenanceCash(@PathVariable Long maintenanceId) {
        try {
            Payment payment = paymentService.approveMaintenanceCash(maintenanceId);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // =====================================
    // 7. STANDARD CRUD
    // =====================================
    @PostMapping
    public ResponseEntity<Payment> createPayment(@RequestBody PaymentDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(paymentService.createPayment(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Payment> updatePayment(@PathVariable Long id, @RequestBody PaymentDto dto) {
        return ResponseEntity.ok(paymentService.updatePayment(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable Long id) {
        paymentService.deletePayment(id);
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleBadRequest(IllegalArgumentException ex, HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse(400, "Bad Request", ex.getMessage(), request.getRequestURI()));
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