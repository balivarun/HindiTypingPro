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
public class TypingResultDto {
    private Long id;
    private Long userId;
    private String userName;
    private Long testId;
    private String testTitle;
    private Double speed;
    private Double accuracy;
    private Integer mistakes;
    private Integer correctChars;
    private Integer wrongChars;
    private Integer totalChars;
    private Double cpm;
    private TypingResult.TypingLayout layout;
    private Integer duration;
    private LocalDateTime createdAt;
}
