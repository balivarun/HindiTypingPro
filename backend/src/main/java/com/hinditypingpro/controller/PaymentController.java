package com.hinditypingpro.controller;

import com.hinditypingpro.dto.ApiResponse;
import com.hinditypingpro.dto.CreateOrderResponse;
import com.hinditypingpro.dto.VerifyPaymentRequest;
import com.hinditypingpro.entity.User;
import com.hinditypingpro.service.CouponService;
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
    public ResponseEntity<CreateOrderResponse> createOrder(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) String couponCode) {
        return ResponseEntity.ok(paymentService.createOrder(user, couponCode));
    }

    @GetMapping("/validate-coupon")
    public ResponseEntity<ApiResponse<Map<String, Object>>> validateCoupon(@RequestParam String code) {
        CouponService.CouponValidation v = paymentService.validateCoupon(code);
        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "valid", v.valid(),
                "message", v.message(),
                "discountPercent", v.discountPercent(),
                "finalAmountPaise", v.finalAmountPaise()
        )));
    }

    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyPayment(
            @RequestBody VerifyPaymentRequest request,
            @AuthenticationPrincipal User user) {
        paymentService.verifyAndActivate(request, user);
        return ResponseEntity.ok(Map.of("success", true, "isPremium", true));
    }

    @PostMapping("/test-activate")
    public ResponseEntity<Map<String, Object>> testActivate(
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal User user) {
        paymentService.testActivate(body.get("orderId"), user);
        return ResponseEntity.ok(Map.of("success", true, "isPremium", true));
    }
}
