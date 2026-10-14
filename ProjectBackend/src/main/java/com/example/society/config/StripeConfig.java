package com.example.society.config;

import com.stripe.Stripe;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class StripeConfig {

    private static final Logger logger = LoggerFactory.getLogger(StripeConfig.class);

    @Value("${stripe.secret.key:sk_test_placeholder}")
    private String secretKey;

    @PostConstruct
    public void init() {
        if (secretKey != null && !secretKey.isBlank()) {
            Stripe.apiKey = secretKey;
            logger.info("Stripe API initialized with key: {}...", secretKey.substring(0, Math.min(secretKey.length(), 8)));
        } else {
            logger.warn("Stripe secret key not provided. Set stripe.secret.key in application.properties or environment variable STRIPE_SECRET_KEY.");
        }
    }

    public String getSecretKey() {
        return secretKey;
    }
}
