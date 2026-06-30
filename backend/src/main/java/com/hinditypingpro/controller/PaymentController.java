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
        CreateOrderResponse response = paymentService.createOrder(user);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyPayment(
            @RequestBody VerifyPaymentRequest request,
            @AuthenticationPrincipal User user) {
        paymentService.verifyAndActivate(request, user);
        return ResponseEntity.ok(Map.of("success", true, "isPremium", true));
    }
}
