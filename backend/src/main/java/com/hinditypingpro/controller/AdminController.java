package com.hinditypingpro.controller;

import com.hinditypingpro.dto.AdminStatsDto;
import com.hinditypingpro.dto.ApiResponse;
import com.hinditypingpro.dto.TypingTestDto;
import com.hinditypingpro.entity.Coupon;
import com.hinditypingpro.entity.User;
import com.hinditypingpro.service.AdminService;
import com.hinditypingpro.service.CouponService;
import com.hinditypingpro.service.TypingTestService;
import com.hinditypingpro.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin", description = "Admin management APIs")
@SecurityRequirement(name = "bearerAuth")
public class AdminController {

    private final TypingTestService testService;
    private final UserService userService;
    private final AdminService adminService;
    private final CouponService couponService;

    @GetMapping("/stats")
    @Operation(summary = "Get admin revenue and user stats")
    public ResponseEntity<ApiResponse<AdminStatsDto>> getStats() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getStats()));
    }

    @PostMapping("/tests")
    @Operation(summary = "Create a new typing test")
    public ResponseEntity<ApiResponse<TypingTestDto>> createTest(@Valid @RequestBody TypingTestDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Test created", testService.createTest(dto)));
    }

    @PutMapping("/tests/{id}")
    @Operation(summary = "Update a typing test")
    public ResponseEntity<ApiResponse<TypingTestDto>> updateTest(
            @PathVariable Long id, @Valid @RequestBody TypingTestDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Test updated", testService.updateTest(id, dto)));
    }

    @DeleteMapping("/tests/{id}")
    @Operation(summary = "Delete a typing test")
    public ResponseEntity<ApiResponse<Void>> deleteTest(@PathVariable Long id) {
        testService.deleteTest(id);
        return ResponseEntity.ok(ApiResponse.success("Test deleted", null));
    }

    @GetMapping("/users")
    @Operation(summary = "Get all users")
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.success(userService.getAllUsers()));
    }

    @DeleteMapping("/users/{id}")
    @Operation(summary = "Delete a user")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("User deleted", null));
    }

    @GetMapping("/coupons")
    @Operation(summary = "Get all coupons")
    public ResponseEntity<ApiResponse<List<Coupon>>> getCoupons() {
        return ResponseEntity.ok(ApiResponse.success(couponService.getAllCoupons()));
    }

    @PostMapping("/coupons")
    @Operation(summary = "Create a coupon")
    public ResponseEntity<ApiResponse<Coupon>> createCoupon(@RequestBody Map<String, Object> body) {
        String code = (String) body.get("code");
        int discountPercent = Integer.parseInt(body.get("discountPercent").toString());
        Integer maxUses = body.get("maxUses") != null ? Integer.parseInt(body.get("maxUses").toString()) : null;
        Coupon coupon = couponService.createCoupon(code, discountPercent, maxUses);
        return ResponseEntity.ok(ApiResponse.success("Coupon created", coupon));
    }

    @PatchMapping("/coupons/{id}/toggle")
    @Operation(summary = "Toggle coupon active status")
    public ResponseEntity<ApiResponse<Void>> toggleCoupon(@PathVariable Long id) {
        couponService.toggleCoupon(id);
        return ResponseEntity.ok(ApiResponse.success("Coupon toggled", null));
    }

    @DeleteMapping("/coupons/{id}")
    @Operation(summary = "Delete a coupon")
    public ResponseEntity<ApiResponse<Void>> deleteCoupon(@PathVariable Long id) {
        couponService.deleteCoupon(id);
        return ResponseEntity.ok(ApiResponse.success("Coupon deleted", null));
    }
}
