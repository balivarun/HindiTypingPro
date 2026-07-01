package com.hinditypingpro.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDto {
    private Long id;
    private String name;
    private String email;
    private String role;
    private LocalDateTime createdAt;
    private Long totalTests;
    private Double averageSpeed;
    private Double averageAccuracy;
    private Double bestSpeed;
    private Integer currentStreak;
    private Integer longestStreak;
    private Integer dailyGoal;
    private Integer todayWordCount;
    private Boolean isPremium;
    private LocalDate examDate;
    private String examType;
}
