package com.hinditypingpro.controller;

import com.hinditypingpro.dto.ApiResponse;
import com.hinditypingpro.dto.TypingTestDto;
import com.hinditypingpro.entity.TypingTest;
import com.hinditypingpro.service.TypingTestService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tests")
@RequiredArgsConstructor
@Tag(name = "Typing Tests", description = "Typing test management APIs")
@SecurityRequirement(name = "bearerAuth")
public class TypingTestController {

    private final TypingTestService testService;

    @GetMapping
    @Operation(summary = "Get all typing tests")
    public ResponseEntity<ApiResponse<List<TypingTestDto>>> getAllTests(
            @RequestParam(required = false) String difficulty) {
        List<TypingTestDto> tests;
        if (difficulty != null) {
            tests = testService.getTestsByDifficulty(TypingTest.Difficulty.valueOf(difficulty.toUpperCase()));
        } else {
            tests = testService.getAllTests();
        }
        return ResponseEntity.ok(ApiResponse.success(tests));
    }

    @GetMapping("/random")
    @Operation(summary = "Get a random typing test")
    public ResponseEntity<ApiResponse<TypingTestDto>> getRandomTest(
            @RequestParam(required = false) String difficulty) {
        return ResponseEntity.ok(ApiResponse.success(testService.getRandomTest(difficulty)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get typing test by ID")
    public ResponseEntity<ApiResponse<TypingTestDto>> getTestById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(testService.getTestById(id)));
    }
}
