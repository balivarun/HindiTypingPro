package com.hinditypingpro.service;

import com.hinditypingpro.dto.CreateOrderResponse;
import com.hinditypingpro.dto.VerifyPaymentRequest;
import com.hinditypingpro.entity.Payment;
import com.hinditypingpro.entity.User;
import com.hinditypingpro.repository.PaymentRepository;
import com.hinditypingpro.repository.UserRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.HexFormat;

@Service
@RequiredArgsConstructor
public class PaymentService {

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    @Value("${app.premium.price.paise:9900}")
    private int priceInPaise;

    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;

    public CreateOrderResponse createOrder(User user) {
        try {
            RazorpayClient client = new RazorpayClient(keyId, keySecret);

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", priceInPaise);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "rcpt_" + user.getId());

            Order order = client.orders.create(orderRequest);

            Payment payment = Payment.builder()
                    .user(user)
                    .razorpayOrderId(order.get("id"))
                    .amount(priceInPaise)
                    .currency("INR")
                    .status(Payment.Status.CREATED)
                    .build();
            paymentRepository.save(payment);

            return CreateOrderResponse.builder()
                    .orderId(order.get("id"))
                    .amount(priceInPaise)
                    .currency("INR")
                    .keyId(keyId)
                    .build();

        } catch (RazorpayException e) {
            throw new RuntimeException("Failed to create payment order: " + e.getMessage(), e);
        }
    }

    @Transactional
    public void verifyAndActivate(VerifyPaymentRequest req, User user) {
        if (!verifySignature(req.getRazorpayOrderId(), req.getRazorpayPaymentId(), req.getRazorpaySignature())) {
            // Mark payment as failed
            paymentRepository.findByRazorpayOrderId(req.getRazorpayOrderId()).ifPresent(p -> {
                p.setStatus(Payment.Status.FAILED);
                paymentRepository.save(p);
            });
            throw new IllegalArgumentException("Payment signature verification failed");
        }

        // Update payment record
        paymentRepository.findByRazorpayOrderId(req.getRazorpayOrderId()).ifPresent(p -> {
            p.setRazorpayPaymentId(req.getRazorpayPaymentId());
            p.setRazorpaySignature(req.getRazorpaySignature());
            p.setStatus(Payment.Status.PAID);
            paymentRepository.save(p);
        });

        // Upgrade user to premium
        user.setIsPremium(true);
        userRepository.save(user);
    }

    private boolean verifySignature(String orderId, String paymentId, String signature) {
        try {
            String message = orderId + "|" + paymentId;
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec keySpec = new SecretKeySpec(keySecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(keySpec);
            byte[] hash = mac.doFinal(message.getBytes(StandardCharsets.UTF_8));
            String expected = HexFormat.of().formatHex(hash);
            return expected.equals(signature);
        } catch (Exception e) {
            return false;
        }
    }
}
