package com.example.society.service;

import com.example.society.dto.CashPaymentRequest;
import com.example.society.dto.PaymentDto;
import com.example.society.entity.Flat;
import com.example.society.entity.Maintenance;
import com.example.society.entity.Payment;
import com.example.society.entity.Resident;
import com.example.society.exception.ResourceNotFoundException;
import com.example.society.repository.MaintenanceRepository;
import com.example.society.repository.PaymentRepository;
import com.example.society.repository.ResidentRepository;
import com.stripe.model.checkout.Session;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PaymentService {

    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);

    private final PaymentRepository paymentRepo;
    private final MaintenanceRepository maintenanceRepo;
    private final ResidentRepository residentRepo;
    private final StripeService stripeService;
    private final EmailService emailService;

    public PaymentService(PaymentRepository paymentRepo,
                          MaintenanceRepository maintenanceRepo,
                          ResidentRepository residentRepo,
                          StripeService stripeService,
                          EmailService emailService) {
        this.paymentRepo = paymentRepo;
        this.maintenanceRepo = maintenanceRepo;
        this.residentRepo = residentRepo;
        this.stripeService = stripeService;
        this.emailService = emailService;
    }

    public List<Payment> getAllPayments() {
        return paymentRepo.findAll();
    }

    public Payment getPaymentById(Long id) {
        return paymentRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + id));
    }

    public List<Payment> getPaymentsByResidentId(Long residentId) {
        return paymentRepo.findByResidentId(residentId);
    }

    public List<Payment> getPaymentsByMaintenanceId(Long maintenanceId) {
        return paymentRepo.findByMaintenanceId(maintenanceId);
    }

    public boolean isPaidStatus(String status) {
        if (status == null) return false;
        String s = status.trim().toUpperCase();
        return s.equals("SUCCESS") || s.equals("PAID") || s.equals("SUCCESSFUL");
    }

    // ==========================================
    // 1. ONLINE PAYMENT: STRIPE CHECKOUT SESSION
    // ==========================================
    @Transactional
    public Map<String, String> createStripeSession(Long maintenanceId) throws Exception {
        Maintenance maintenance = maintenanceRepo.findById(maintenanceId)
                .orElseThrow(() -> new ResourceNotFoundException("Maintenance not found with id: " + maintenanceId));

        if (isPaidStatus(maintenance.getStatus())) {
            throw new IllegalArgumentException("This maintenance invoice is already paid");
        }

        List<Payment> existingPayments = paymentRepo.findByMaintenanceId(maintenanceId);
        for (Payment p : existingPayments) {
            if (isPaidStatus(p.getStatus())) {
                throw new IllegalArgumentException("Payment has already been completed for this maintenance invoice");
            }
        }

        double amount = maintenance.getAmount().doubleValue();
        Flat flat = maintenance.getFlat();
        String desc = "Maintenance Bill - " + (flat != null ? flat.getBuilding() + " " + flat.getFlatNumber() : "") 
                + " (" + maintenance.getMonth() + " " + maintenance.getYear() + ")";

        Session session = stripeService.createCheckoutSession(amount, maintenanceId, desc);

        // Find existing payment for this maintenance or create new
        Payment payment = paymentRepo.findByMaintenance_Id(maintenanceId).orElse(null);
        if (payment == null) {
            payment = new Payment();
            payment.setMaintenance(maintenance);
            payment.setResident(maintenance.getResident());
        }

        payment.setAmount(maintenance.getAmount());
        payment.setTotalAmount(amount);
        payment.setNetAmount(amount);
        payment.setPaymentMode("Online");
        payment.setPaymentMethod("Online / Stripe");
        payment.setTransactionId(session.getId());
        payment.setTransactionRef(session.getId());
        payment.setStatus("PENDING");
        payment.setPaymentDate(LocalDate.now());
        payment.setPaymentTime(LocalDateTime.now());
        payment.setRemarks("Stripe checkout initiated, awaiting card/online confirmation");

        paymentRepo.save(payment);

        Map<String, String> result = new HashMap<>();
        result.put("url", session.getUrl());
        result.put("sessionId", session.getId());
        return result;
    }

    // ==========================================
    // 2. ONLINE PAYMENT: CONFIRM PAYMENT
    // ==========================================
    @Transactional
    public Object confirmPayment(String sessionId) {
        if (sessionId == null || sessionId.isBlank()) {
            throw new RuntimeException("Session id cannot be empty");
        }

        Payment payment = paymentRepo.findByTransactionRef(sessionId);
        if (payment == null) {
            payment = paymentRepo.findByTransactionId(sessionId);
        }

        if (payment == null) {
            throw new RuntimeException("Payment record not found for session id: " + sessionId);
        }

        try {
            Session session = stripeService.retrieveSession(sessionId);

            if ("paid".equalsIgnoreCase(session.getPaymentStatus())) {
                payment.setStatus("SUCCESS");
                payment.setPaymentMethod("Card / Stripe");
                payment.setPaymentMode("Online");
                String intent = session.getPaymentIntent();
                if (intent != null && !intent.isBlank()) {
                    payment.setTransactionRef(intent);
                    payment.setTransactionId(intent);
                }
                payment.setPaymentDate(LocalDate.now());
                payment.setPaymentTime(LocalDateTime.now());
                payment.setRemarks("Payment completed successfully via Stripe");

                Maintenance maintenance = payment.getMaintenance();
                if (maintenance != null) {
                    maintenance.setStatus("Paid");
                    maintenanceRepo.save(maintenance);
                }

                paymentRepo.save(payment);

                // Optional email notification
                if (payment.getResident() != null && payment.getResident().getEmail() != null) {
                    emailService.sendInvoiceEmail(payment.getResident().getEmail(), null, payment.getId());
                }

                return payment;
            } else {
                handleFailure(payment, "Payment status not paid: " + session.getPaymentStatus());
                throw new RuntimeException("Payment not completed (Status: " + session.getPaymentStatus() + ")");
            }
        } catch (Exception e) {
            handleFailure(payment, e.getMessage());
            throw new RuntimeException("Payment verification failed: " + e.getMessage());
        }
    }

    // ==========================================
    // 3. CASH PAYMENT: RESIDENT SUBMISSION
    // ==========================================
    @Transactional
    public Payment recordCashPayment(CashPaymentRequest request) {
        Maintenance maintenance = maintenanceRepo.findById(request.getMaintenanceId())
                .orElseThrow(() -> new ResourceNotFoundException("Maintenance not found with id: " + request.getMaintenanceId()));

        if (isPaidStatus(maintenance.getStatus())) {
            throw new IllegalArgumentException("This maintenance invoice is already paid");
        }

        List<Payment> existingPayments = paymentRepo.findByMaintenanceId(maintenance.getId());
        for (Payment p : existingPayments) {
            if (isPaidStatus(p.getStatus())) {
                throw new IllegalArgumentException("Payment has already been completed for this maintenance invoice");
            }
        }

        if ("Pending Cash Approval".equalsIgnoreCase(maintenance.getStatus())) {
            throw new IllegalArgumentException("A cash payment request has already been recorded and is awaiting admin approval.");
        }

        Resident resident;
        if (request.getResidentId() != null) {
            resident = residentRepo.findById(request.getResidentId())
                    .orElse(maintenance.getResident());
        } else {
            resident = maintenance.getResident();
        }

        if (resident == null) {
            throw new IllegalArgumentException("Resident associated with this maintenance record could not be found");
        }

        // Find existing payment for this maintenance or create new
        Payment payment = paymentRepo.findByMaintenance_Id(maintenance.getId()).orElse(null);
        if (payment == null) {
            payment = new Payment();
            payment.setMaintenance(maintenance);
            payment.setResident(resident);
        }

        String txn = "CASH-" + System.currentTimeMillis();
        payment.setAmount(maintenance.getAmount());
        payment.setTotalAmount(maintenance.getAmount().doubleValue());
        payment.setNetAmount(maintenance.getAmount().doubleValue());
        payment.setPaymentMode("Cash");
        payment.setPaymentMethod("Cash");
        payment.setTransactionId(txn);
        payment.setTransactionRef(txn);
        payment.setStatus("Pending Approval");
        payment.setPaymentDate(LocalDate.now());
        payment.setPaymentTime(LocalDateTime.now());
        payment.setRemarks(request.getRemarks() != null && !request.getRemarks().isBlank() 
                ? request.getRemarks() 
                : "Cash payment submitted by resident, awaiting Admin approval");

        // Set maintenance status to "Pending Cash Approval"
        maintenance.setStatus("Pending Cash Approval");
        maintenanceRepo.save(maintenance);

        return paymentRepo.save(payment);
    }

    // ==========================================
    // 4. CASH PAYMENT: ADMIN MANUAL APPROVAL
    // ==========================================
    @Transactional
    public Payment approveCashPayment(Long paymentId) {
        Payment payment = getPaymentById(paymentId);

        if (isPaidStatus(payment.getStatus())) {
            throw new IllegalArgumentException("Payment is already completed and marked as paid.");
        }

        payment.setStatus("SUCCESS");
        payment.setPaymentDate(LocalDate.now());
        payment.setPaymentTime(LocalDateTime.now());
        payment.setRemarks("Cash payment verified and approved by Admin");

        Maintenance maintenance = payment.getMaintenance();
        if (maintenance != null) {
            maintenance.setStatus("Paid");
            maintenanceRepo.save(maintenance);
        }

        return paymentRepo.save(payment);
    }

    // ==========================================
    // 5. CASH PAYMENT: ADMIN REJECTION
    // ==========================================
    @Transactional
    public Payment rejectCashPayment(Long paymentId, String reason) {
        Payment payment = getPaymentById(paymentId);

        if (isPaidStatus(payment.getStatus())) {
            throw new IllegalArgumentException("Cannot reject an already paid payment.");
        }

        payment.setStatus("REJECTED");
        payment.setRemarks(reason != null && !reason.isBlank() ? reason : "Cash payment rejected by Admin");

        Maintenance maintenance = payment.getMaintenance();
        if (maintenance != null) {
            maintenance.setStatus("Pending");
            maintenanceRepo.save(maintenance);
        }

        return paymentRepo.save(payment);
    }

    // ==========================================
    // 6. APPROVE CASH DIRECTLY FROM MAINTENANCE
    // ==========================================
    @Transactional
    public Payment approveMaintenanceCash(Long maintenanceId) {
        Maintenance maintenance = maintenanceRepo.findById(maintenanceId)
                .orElseThrow(() -> new ResourceNotFoundException("Maintenance not found with id: " + maintenanceId));

        if (isPaidStatus(maintenance.getStatus())) {
            throw new IllegalArgumentException("This maintenance invoice is already paid.");
        }

        Payment payment = paymentRepo.findByMaintenance_Id(maintenanceId).orElse(null);

        if (payment == null) {
            payment = new Payment();
            payment.setMaintenance(maintenance);
            payment.setResident(maintenance.getResident());
            payment.setAmount(maintenance.getAmount());
            payment.setTotalAmount(maintenance.getAmount().doubleValue());
            payment.setNetAmount(maintenance.getAmount().doubleValue());
            payment.setPaymentMode("Cash");
            payment.setPaymentMethod("Cash");
            payment.setTransactionId("CASH-" + System.currentTimeMillis());
            payment.setTransactionRef("CASH-" + System.currentTimeMillis());
        }

        payment.setStatus("SUCCESS");
        payment.setPaymentDate(LocalDate.now());
        payment.setPaymentTime(LocalDateTime.now());
        payment.setRemarks("Cash payment directly approved by Admin");

        maintenance.setStatus("Paid");
        maintenanceRepo.save(maintenance);

        return paymentRepo.save(payment);
    }

    // ==========================================
    // 7. STANDARD CRUD
    // ==========================================
    @Transactional
    public Payment createPayment(PaymentDto dto) {
        if (dto.getMaintenanceId() == null) {
            throw new IllegalArgumentException("Maintenance ID is required to record a payment.");
        }
        Maintenance maintenance = maintenanceRepo.findById(dto.getMaintenanceId())
                .orElseThrow(() -> new ResourceNotFoundException("Maintenance not found with id: " + dto.getMaintenanceId()));

        if (isPaidStatus(maintenance.getStatus())) {
            throw new IllegalArgumentException("This maintenance invoice is already paid. A resident can pay maintenance only once.");
        }

        List<Payment> existingPayments = paymentRepo.findByMaintenanceId(maintenance.getId());
        for (Payment p : existingPayments) {
            if (isPaidStatus(p.getStatus())) {
                throw new IllegalArgumentException("Payment has already been completed for this maintenance invoice. Duplicate payment is not allowed.");
            }
        }

        Resident resident = null;
        if (dto.getResidentId() != null) {
            resident = residentRepo.findById(dto.getResidentId())
                    .orElse(maintenance.getResident());
        } else {
            resident = maintenance.getResident();
        }

        if (resident == null) {
            throw new IllegalArgumentException("Resident associated with this maintenance record could not be found.");
        }

        Payment payment = new Payment();
        payment.setMaintenance(maintenance);
        payment.setResident(resident);
        payment.setAmount(dto.getAmount() != null ? dto.getAmount() : maintenance.getAmount());
        payment.setPaymentDate(dto.getPaymentDate() != null ? dto.getPaymentDate() : LocalDate.now());
        payment.setPaymentTime(dto.getPaymentTime() != null ? dto.getPaymentTime() : LocalDateTime.now());
        payment.setPaymentMode(dto.getPaymentMode() != null ? dto.getPaymentMode() : "Cash");
        payment.setPaymentMethod(dto.getPaymentMethod() != null ? dto.getPaymentMethod() : payment.getPaymentMode());
        payment.setTransactionId(dto.getTransactionId() != null ? dto.getTransactionId() : "TXN-" + System.currentTimeMillis());
        payment.setTransactionRef(dto.getTransactionRef() != null ? dto.getTransactionRef() : payment.getTransactionId());
        payment.setStatus(dto.getStatus() != null ? dto.getStatus() : "SUCCESS");
        payment.setRemarks(dto.getRemarks());

        if (isPaidStatus(payment.getStatus())) {
            maintenance.setStatus("Paid");
            maintenanceRepo.save(maintenance);
        } else if ("Pending Approval".equalsIgnoreCase(payment.getStatus())) {
            maintenance.setStatus("Pending Cash Approval");
            maintenanceRepo.save(maintenance);
        }

        return paymentRepo.save(payment);
    }

    @Transactional
    public Payment updatePayment(Long id, PaymentDto dto) {
        Payment payment = getPaymentById(id);

        // Admin cannot change status of paid payments
        if (isPaidStatus(payment.getStatus())) {
            if (dto.getStatus() != null && !dto.getStatus().equalsIgnoreCase(payment.getStatus())) {
                throw new IllegalArgumentException("Admin cannot change the status of an already paid payment.");
            }
        }

        if (dto.getAmount() != null) payment.setAmount(dto.getAmount());
        if (dto.getPaymentDate() != null) payment.setPaymentDate(dto.getPaymentDate());
        if (dto.getPaymentMode() != null) payment.setPaymentMode(dto.getPaymentMode());
        if (dto.getPaymentMethod() != null) payment.setPaymentMethod(dto.getPaymentMethod());
        if (dto.getTransactionId() != null) payment.setTransactionId(dto.getTransactionId());
        if (dto.getTransactionRef() != null) payment.setTransactionRef(dto.getTransactionRef());
        if (dto.getRemarks() != null) payment.setRemarks(dto.getRemarks());
        if (dto.getStatus() != null) {
            payment.setStatus(dto.getStatus());
            if (isPaidStatus(dto.getStatus())) {
                if (payment.getMaintenance() != null) {
                    payment.getMaintenance().setStatus("Paid");
                    maintenanceRepo.save(payment.getMaintenance());
                }
            }
        }
        return paymentRepo.save(payment);
    }

    public void deletePayment(Long id) {
        Payment payment = getPaymentById(id);
        if (isPaidStatus(payment.getStatus())) {
            throw new IllegalArgumentException("Paid payment records cannot be deleted.");
        }
        paymentRepo.delete(payment);
    }

    private void handleFailure(Payment payment, String reason) {
        payment.setStatus("FAILED");
        payment.setRemarks("Payment failed: " + reason);
        paymentRepo.save(payment);
    }
}
