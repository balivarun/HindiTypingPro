package com.hinditypingpro.service;

import com.hinditypingpro.dto.UserProfileDto;
import com.hinditypingpro.entity.TypingResult;
import com.hinditypingpro.entity.User;
import com.hinditypingpro.exception.ResourceNotFoundException;
import com.hinditypingpro.repository.TypingResultRepository;
import com.hinditypingpro.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final TypingResultRepository resultRepository;

    public UserProfileDto getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<TypingResult> results = resultRepository.findByUserId(user.getId());

        double avgSpeed = results.stream().mapToDouble(TypingResult::getSpeed).average().orElse(0);
        double avgAccuracy = results.stream().mapToDouble(TypingResult::getAccuracy).average().orElse(0);
        double bestSpeed = results.stream().mapToDouble(TypingResult::getSpeed).max().orElse(0);

        return UserProfileDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .createdAt(user.getCreatedAt())
                .totalTests((long) results.size())
                .averageSpeed(Math.round(avgSpeed * 100.0) / 100.0)
                .averageAccuracy(Math.round(avgAccuracy * 100.0) / 100.0)
                .bestSpeed(Math.round(bestSpeed * 100.0) / 100.0)
                .currentStreak(user.getCurrentStreak())
                .longestStreak(user.getLongestStreak())
                .dailyGoal(user.getDailyGoal())
                .todayWordCount(user.getTodayWordCount())
                .isPremium(user.getIsPremium())
                .examDate(user.getExamDate())
                .examType(user.getExamType())
                .build();
    }

    public UserProfileDto updateDailyGoal(String email, int goal) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setDailyGoal(goal);
        userRepository.save(user);
        return getProfile(email);
    }

    public UserProfileDto updateExamInfo(String email, String examType, LocalDate examDate) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setExamType(examType);
        user.setExamDate(examDate);
        userRepository.save(user);
        return getProfile(email);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }
}
