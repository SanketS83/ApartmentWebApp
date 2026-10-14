package com.example.society.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    public EmailService(@Autowired(required = false) JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOtp(String email, String otp) {
        logger.info("\n========================================================");
        logger.info("   [SOCIETY PORTAL] OTP GENERATED FOR: {}", email);
        logger.info("   >>> YOUR 6-DIGIT OTP IS: {} <<<", otp);
        logger.info("   VALID FOR 5 MINUTES");
        logger.info("========================================================\n");

        if (mailSender != null) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(email);
                message.setSubject("Society Management - Password Reset OTP");
                message.setText("Dear Resident,\n\nYour One Time Password (OTP) for password reset is: " 
                        + otp + "\n\nThis OTP is valid for 5 minutes. If you did not request this, please contact society administration immediately.\n\nRegards,\nSociety Management Team");

                mailSender.send(message);
                logger.info("Email dispatched successfully to: {}", email);
            } catch (Exception e) {
                logger.warn("Mail dispatch encountered an issue (SMTP not configured or auth error): {}. OTP was printed above for testing.", e.getMessage());
            }
        }
    }

    public void sendInvoiceEmail(String email, byte[] pdf, Long paymentId) {
        logger.info("Invoice receipt triggered for payment #{} to email: {}", paymentId, email);
    }
}
