package com.hinditypingpro.controller;

import com.hinditypingpro.dto.ApiResponse;
import com.hinditypingpro.dto.TypingTestDto;
import com.hinditypingpro.entity.User;
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

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin", description = "Admin management APIs")
@SecurityRequirement(name = "bearerAuth")
public class AdminController {

    private final TypingTestService testService;
    private final UserService userService;

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
}
