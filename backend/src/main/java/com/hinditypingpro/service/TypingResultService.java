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

import java.time.LocalDate;
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

        TypingResultDto dto = toDto(resultRepository.save(result));
        int wordsTyped = request.getTotalChars() / 5;
        updateStreakAndGoal(user, wordsTyped);
        return dto;
    }

    private void updateStreakAndGoal(User user, int wordsTyped) {
        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);

        if (today.equals(user.getTodayDate())) {
            user.setTodayWordCount(user.getTodayWordCount() + wordsTyped);
        } else {
            user.setTodayWordCount(wordsTyped);
            user.setTodayDate(today);
        }

        LocalDate lastActive = user.getLastActiveDate();
        if (lastActive == null || lastActive.isBefore(yesterday)) {
            user.setCurrentStreak(1);
        } else if (lastActive.equals(yesterday)) {
            user.setCurrentStreak(user.getCurrentStreak() + 1);
        }
        // if lastActive == today, no change to streak

        user.setLastActiveDate(today);

        if (user.getCurrentStreak() > user.getLongestStreak()) {
            user.setLongestStreak(user.getCurrentStreak());
        }

        userRepository.save(user);
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
