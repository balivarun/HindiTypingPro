package com.hinditypingpro.controller;

import com.hinditypingpro.dto.ApiResponse;
import com.hinditypingpro.dto.LeaderboardEntry;
import com.hinditypingpro.service.TypingResultService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
@RequiredArgsConstructor
@Tag(name = "Leaderboard", description = "Leaderboard APIs")
@SecurityRequirement(name = "bearerAuth")
public class LeaderboardController {

    private final TypingResultService resultService;

    @GetMapping
    @Operation(summary = "Get leaderboard by speed (default) or accuracy")
    public ResponseEntity<ApiResponse<List<LeaderboardEntry>>> getLeaderboard(
            @RequestParam(defaultValue = "speed") String sortBy) {
        List<LeaderboardEntry> entries = sortBy.equalsIgnoreCase("accuracy")
                ? resultService.getAccuracyLeaderboard()
                : resultService.getSpeedLeaderboard();
        return ResponseEntity.ok(ApiResponse.success(entries));
    }
}
