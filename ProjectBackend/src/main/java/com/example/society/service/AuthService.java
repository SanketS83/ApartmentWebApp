package com.example.society.service;

import com.example.society.entity.Resident;
import com.example.society.repository.ResidentRepository;
import com.example.society.util.PasswordUtil;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final ResidentRepository residentRepo;
    private final OtpService otpService;
    private final EmailService emailService;

    public AuthService(ResidentRepository residentRepo,
                       OtpService otpService,
                       EmailService emailService) {
        this.residentRepo = residentRepo;
        this.otpService = otpService;
        this.emailService = emailService;
    }

    // SEND OTP
    public void sendOtp(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email address is required");
        }

        Resident user = residentRepo.findByEmail(email.trim())
                .orElseThrow(() -> new RuntimeException("Email not registered with any resident"));

        String otp = otpService.generateOtp(user.getEmail());

        emailService.sendOtp(user.getEmail(), otp);
    }

    // VERIFY OTP
    public void verifyOtp(String email, String otp) {
        if (email == null || otp == null) {
            throw new IllegalArgumentException("Email and OTP are required");
        }

        boolean isValid = otpService.verifyOtp(email.trim(), otp.trim());

        if (!isValid) {
            throw new RuntimeException("Invalid or expired OTP");
        }
    }

    // RESET PASSWORD
    public void resetPassword(String email, String newPassword) {
        if (email == null || newPassword == null || newPassword.trim().isEmpty()) {
            throw new IllegalArgumentException("Email and new password are required");
        }

        Resident user = residentRepo.findByEmail(email.trim())
                .orElseThrow(() -> new RuntimeException("Resident not found for email: " + email));

        user.setPassword(PasswordUtil.hashPassword(newPassword.trim()));
        residentRepo.save(user);

        otpService.clearOtp(email.trim());
    }
}
