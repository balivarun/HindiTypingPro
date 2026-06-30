package com.hinditypingpro.controller;

import com.hinditypingpro.dto.CreateOrderResponse;
import com.hinditypingpro.dto.VerifyPaymentRequest;
import com.hinditypingpro.entity.User;
import com.hinditypingpro.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-order")
    public ResponseEntity<CreateOrderResponse> createOrder(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(paymentService.createOrder(user));
    }

    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyPayment(
            @RequestBody VerifyPaymentRequest request,
            @AuthenticationPrincipal User user) {
        paymentService.verifyAndActivate(request, user);
        return ResponseEntity.ok(Map.of("success", true, "isPremium", true));
    }

    /**
     * Test-mode endpoint: bypasses Razorpay and directly upgrades the user.
     * Only works when RAZORPAY_KEY_ID is not configured (placeholder key).
     * Remove or disable this in production once real keys are set.
     */
    @PostMapping("/test-activate")
    public ResponseEntity<Map<String, Object>> testActivate(
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal User user) {
        paymentService.testActivate(body.get("orderId"), user);
        return ResponseEntity.ok(Map.of("success", true, "isPremium", true));
    }
}
