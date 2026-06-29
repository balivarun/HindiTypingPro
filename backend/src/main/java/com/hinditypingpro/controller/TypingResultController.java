package com.hinditypingpro.controller;

import com.hinditypingpro.dto.ApiResponse;
import com.hinditypingpro.dto.TypingResultDto;
import com.hinditypingpro.dto.TypingResultRequest;
import com.hinditypingpro.service.TypingResultService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/results")
@RequiredArgsConstructor
@Tag(name = "Typing Results", description = "Typing results APIs")
@SecurityRequirement(name = "bearerAuth")
public class TypingResultController {

    private final TypingResultService resultService;

    @PostMapping
    @Operation(summary = "Save a typing result")
    public ResponseEntity<ApiResponse<TypingResultDto>> saveResult(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody TypingResultRequest request) {
        TypingResultDto result = resultService.saveResult(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Result saved successfully", result));
    }

    @GetMapping("/history")
    @Operation(summary = "Get user typing history")
    public ResponseEntity<ApiResponse<List<TypingResultDto>>> getHistory(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<TypingResultDto> history = resultService.getUserHistory(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(history));
    }
}
