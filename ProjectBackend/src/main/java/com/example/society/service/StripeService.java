package com.example.society.service;

import com.stripe.exception.StripeException;
import com.stripe.model.Refund;
import com.stripe.model.checkout.Session;
import com.stripe.param.RefundCreateParams;
import com.stripe.param.checkout.SessionCreateParams;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class StripeService {

    private static final Logger logger = LoggerFactory.getLogger(StripeService.class);

    @Value("${stripe.secret.key:sk_test_placeholder}")
    private String secretKey;

    public Session createCheckoutSession(Double amount, Long maintenanceId, String description) throws Exception {
        // If real stripe key is set
        if (isRealStripeKey(secretKey)) {
            try {
                SessionCreateParams params =
                        SessionCreateParams.builder()
                                .setMode(SessionCreateParams.Mode.PAYMENT)
                                .setSuccessUrl("http://localhost:4200/resident/payment-success?session_id={CHECKOUT_SESSION_ID}")
                                .setCancelUrl("http://localhost:4200/resident/maintenance")
                                .addLineItem(
                                        SessionCreateParams.LineItem.builder()
                                                .setQuantity(1L)
                                                .setPriceData(
                                                        SessionCreateParams.LineItem.PriceData.builder()
                                                                .setCurrency("inr")
                                                                .setUnitAmount((long) (amount * 100))
                                                                .setProductData(
                                                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                                .setName(description != null ? description : "Maintenance #" + maintenanceId)
                                                                                .build()
                                                                )
                                                                .build()
                                                )
                                                .build()
                                )
                                .build();

                return Session.create(params);
            } catch (StripeException e) {
                logger.error("Stripe Checkout Session creation failed with Stripe API: {}", e.getMessage());
                throw e;
            }
        } else {
            // Development / Test Simulation Session
            logger.info("Using simulated Stripe checkout session for development (no live Stripe key configured)");
            String mockSessionId = "cs_test_mock_" + UUID.randomUUID().toString().replace("-", "").substring(0, 20);
            Session mockSession = new Session();
            mockSession.setId(mockSessionId);
            mockSession.setUrl("http://localhost:4200/resident/payment-success?session_id=" + mockSessionId);
            mockSession.setPaymentStatus("paid");
            mockSession.setPaymentIntent("pi_mock_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16));
            return mockSession;
        }
    }

    public Session retrieveSession(String sessionId) throws Exception {
        if (sessionId != null && sessionId.startsWith("cs_test_mock_")) {
            // Simulated session
            Session mockSession = new Session();
            mockSession.setId(sessionId);
            mockSession.setPaymentStatus("paid");
            mockSession.setPaymentIntent("pi_mock_" + sessionId.substring(Math.min(sessionId.length(), 15)));
            return mockSession;
        }

        try {
            return Session.retrieve(sessionId);
        } catch (Exception e) {
            if (!isRealStripeKey(secretKey)) {
                Session fallback = new Session();
                fallback.setId(sessionId);
                fallback.setPaymentStatus("paid");
                fallback.setPaymentIntent("pi_mock_" + UUID.randomUUID().toString().substring(0, 12));
                return fallback;
            }
            throw e;
        }
    }

    public Refund refundPayment(String paymentIntentId) throws StripeException {
        if (!isRealStripeKey(secretKey) || paymentIntentId.startsWith("pi_mock_")) {
            logger.info("Mock refund processed for payment intent: {}", paymentIntentId);
            Refund refund = new Refund();
            refund.setId("re_mock_" + UUID.randomUUID().toString().substring(0, 12));
            refund.setStatus("succeeded");
            return refund;
        }

        RefundCreateParams params =
                RefundCreateParams.builder()
                        .setPaymentIntent(paymentIntentId)
                        .build();

        return Refund.create(params);
    }

    private boolean isRealStripeKey(String key) {
        return key != null && (key.startsWith("sk_test_") || key.startsWith("sk_live_")) && !key.contains("placeholder") && !key.contains("Mock");
    }
}
