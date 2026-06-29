package com.hinditypingpro.dto;

import com.hinditypingpro.entity.TypingResult;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TypingResultRequest {
    private Long testId;

    @NotNull(message = "Speed is required")
    private Double speed;

    @NotNull(message = "Accuracy is required")
    private Double accuracy;

    @NotNull(message = "Mistakes count is required")
    private Integer mistakes;

    @NotNull(message = "Correct chars count is required")
    private Integer correctChars;

    @NotNull(message = "Wrong chars count is required")
    private Integer wrongChars;

    @NotNull(message = "Total chars count is required")
    private Integer totalChars;

    @NotNull(message = "CPM is required")
    private Double cpm;

    @NotNull(message = "Layout is required")
    private TypingResult.TypingLayout layout;

    @NotNull(message = "Duration is required")
    private Integer duration;
}
