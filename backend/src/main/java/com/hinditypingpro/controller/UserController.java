package com.hinditypingpro.controller;

import com.hinditypingpro.dto.ApiResponse;
import com.hinditypingpro.dto.UserProfileDto;
import com.hinditypingpro.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "User management APIs")
@SecurityRequirement(name = "bearerAuth")
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    @Operation(summary = "Get current user profile")
    public ResponseEntity<ApiResponse<UserProfileDto>> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        UserProfileDto profile = userService.getProfile(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    @PutMapping("/daily-goal")
    @Operation(summary = "Update daily word goal")
    public ResponseEntity<ApiResponse<UserProfileDto>> updateDailyGoal(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam int goal) {
        UserProfileDto profile = userService.updateDailyGoal(userDetails.getUsername(), goal);
        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    @PutMapping("/exam-info")
    @Operation(summary = "Update exam date and type")
    public ResponseEntity<ApiResponse<UserProfileDto>> updateExamInfo(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam String examType,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate examDate) {
        UserProfileDto profile = userService.updateExamInfo(userDetails.getUsername(), examType, examDate);
        return ResponseEntity.ok(ApiResponse.success(profile));
    }
}
