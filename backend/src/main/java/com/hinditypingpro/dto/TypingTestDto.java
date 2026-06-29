package com.hinditypingpro.dto;

import com.hinditypingpro.entity.TypingTest;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TypingTestDto {
    private Long id;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Paragraph is required")
    private String paragraph;

    @NotNull(message = "Difficulty is required")
    private TypingTest.Difficulty difficulty;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
