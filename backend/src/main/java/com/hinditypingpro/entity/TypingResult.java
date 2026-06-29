package com.hinditypingpro.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "typing_results")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TypingResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "test_id")
    private TypingTest typingTest;

    @Column(nullable = false)
    private Double speed;

    @Column(nullable = false)
    private Double accuracy;

    @Column(nullable = false)
    private Integer mistakes;

    @Column(name = "correct_chars", nullable = false)
    private Integer correctChars;

    @Column(name = "wrong_chars", nullable = false)
    private Integer wrongChars;

    @Column(name = "total_chars", nullable = false)
    private Integer totalChars;

    @Column(nullable = false)
    private Double cpm;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypingLayout layout;

    @Column(nullable = false)
    private Integer duration;

    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum TypingLayout {
        KRUTIDEV, REMINGTON_GAIL, INSCRIPT
    }
}
