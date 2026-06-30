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
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private static final String PLACEHOLDER_KEY = "rzp_test_placeholder";

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    @Value("${app.premium.price.paise:9900}")
    private int priceInPaise;

    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;

    public boolean isTestMode() {
        return PLACEHOLDER_KEY.equals(keyId);
    }

    public CreateOrderResponse createOrder(User user) {
        if (isTestMode()) {
            // No real Razorpay keys — return a test order so developers can test the flow
            String fakeOrderId = "test_order_" + UUID.randomUUID().toString().replace("-", "").substring(0, 14);
            Payment payment = Payment.builder()
                    .user(user)
                    .razorpayOrderId(fakeOrderId)
                    .amount(priceInPaise)
                    .currency("INR")
                    .status(Payment.Status.CREATED)
                    .build();
            paymentRepository.save(payment);
            return CreateOrderResponse.builder()
                    .orderId(fakeOrderId)
                    .amount(priceInPaise)
                    .currency("INR")
                    .keyId(keyId)
                    .testMode(true)
                    .build();
        }

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
                    .testMode(false)
                    .build();

        } catch (RazorpayException e) {
            throw new RuntimeException("Failed to create payment order: " + e.getMessage(), e);
        }
    }

    @Transactional
    public void testActivate(String orderId, User user) {
        if (!isTestMode()) {
            throw new IllegalStateException("Test mode is only available without real Razorpay keys");
        }
        paymentRepository.findByRazorpayOrderId(orderId).ifPresent(p -> {
            p.setRazorpayPaymentId("test_pay_" + UUID.randomUUID().toString().replace("-", "").substring(0, 14));
            p.setStatus(Payment.Status.PAID);
            paymentRepository.save(p);
        });
        user.setIsPremium(true);
        userRepository.save(user);
    }

    @Transactional
    public void verifyAndActivate(VerifyPaymentRequest req, User user) {
        if (!verifySignature(req.getRazorpayOrderId(), req.getRazorpayPaymentId(), req.getRazorpaySignature())) {
            paymentRepository.findByRazorpayOrderId(req.getRazorpayOrderId()).ifPresent(p -> {
                p.setStatus(Payment.Status.FAILED);
                paymentRepository.save(p);
            });
            throw new IllegalArgumentException("Payment signature verification failed");
        }

        paymentRepository.findByRazorpayOrderId(req.getRazorpayOrderId()).ifPresent(p -> {
            p.setRazorpayPaymentId(req.getRazorpayPaymentId());
            p.setRazorpaySignature(req.getRazorpaySignature());
            p.setStatus(Payment.Status.PAID);
            paymentRepository.save(p);
        });

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
