package com.hinditypingpro.dto;

import com.hinditypingpro.entity.TypingResult;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaderboardEntry {
    private int rank;
    private Long userId;
    private String userName;
    private Double speed;
    private Double accuracy;
    private TypingResult.TypingLayout layout;
    private LocalDateTime achievedAt;
}
