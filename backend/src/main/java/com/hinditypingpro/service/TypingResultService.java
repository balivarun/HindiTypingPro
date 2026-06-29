package com.hinditypingpro.service;

import com.hinditypingpro.dto.LeaderboardEntry;
import com.hinditypingpro.dto.TypingResultDto;
import com.hinditypingpro.dto.TypingResultRequest;
import com.hinditypingpro.entity.TypingResult;
import com.hinditypingpro.entity.TypingTest;
import com.hinditypingpro.entity.User;
import com.hinditypingpro.exception.ResourceNotFoundException;
import com.hinditypingpro.repository.TypingResultRepository;
import com.hinditypingpro.repository.TypingTestRepository;
import com.hinditypingpro.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@Service
@RequiredArgsConstructor
public class TypingResultService {

    private final TypingResultRepository resultRepository;
    private final UserRepository userRepository;
    private final TypingTestRepository testRepository;

    public TypingResultDto saveResult(String userEmail, TypingResultRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        TypingTest typingTest = null;
        if (request.getTestId() != null) {
            typingTest = testRepository.findById(request.getTestId()).orElse(null);
        }

        TypingResult result = TypingResult.builder()
                .user(user)
                .typingTest(typingTest)
                .speed(request.getSpeed())
                .accuracy(request.getAccuracy())
                .mistakes(request.getMistakes())
                .correctChars(request.getCorrectChars())
                .wrongChars(request.getWrongChars())
                .totalChars(request.getTotalChars())
                .cpm(request.getCpm())
                .layout(request.getLayout())
                .duration(request.getDuration())
                .build();

        return toDto(resultRepository.save(result));
    }

    public List<TypingResultDto> getUserHistory(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return resultRepository.findByUserOrderByCreatedAtDesc(user)
                .stream().map(this::toDto).toList();
    }

    public List<LeaderboardEntry> getSpeedLeaderboard() {
        List<TypingResult> results = resultRepository.findLeaderboardBySpeed();
        AtomicInteger rank = new AtomicInteger(1);
        List<LeaderboardEntry> entries = new ArrayList<>();
        for (TypingResult r : results) {
            entries.add(LeaderboardEntry.builder()
                    .rank(rank.getAndIncrement())
                    .userId(r.getUser().getId())
                    .userName(r.getUser().getName())
                    .speed(r.getSpeed())
                    .accuracy(r.getAccuracy())
                    .layout(r.getLayout())
                    .achievedAt(r.getCreatedAt())
                    .build());
        }
        return entries;
    }

    public List<LeaderboardEntry> getAccuracyLeaderboard() {
        List<TypingResult> results = resultRepository.findLeaderboardByAccuracy();
        AtomicInteger rank = new AtomicInteger(1);
        List<LeaderboardEntry> entries = new ArrayList<>();
        for (TypingResult r : results) {
            entries.add(LeaderboardEntry.builder()
                    .rank(rank.getAndIncrement())
                    .userId(r.getUser().getId())
                    .userName(r.getUser().getName())
                    .speed(r.getSpeed())
                    .accuracy(r.getAccuracy())
                    .layout(r.getLayout())
                    .achievedAt(r.getCreatedAt())
                    .build());
        }
        return entries;
    }

    private TypingResultDto toDto(TypingResult result) {
        return TypingResultDto.builder()
                .id(result.getId())
                .userId(result.getUser().getId())
                .userName(result.getUser().getName())
                .testId(result.getTypingTest() != null ? result.getTypingTest().getId() : null)
                .testTitle(result.getTypingTest() != null ? result.getTypingTest().getTitle() : null)
                .speed(result.getSpeed())
                .accuracy(result.getAccuracy())
                .mistakes(result.getMistakes())
                .correctChars(result.getCorrectChars())
                .wrongChars(result.getWrongChars())
                .totalChars(result.getTotalChars())
                .cpm(result.getCpm())
                .layout(result.getLayout())
                .duration(result.getDuration())
                .createdAt(result.getCreatedAt())
                .build();
    }
}
