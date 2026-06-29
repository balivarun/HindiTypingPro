package com.hinditypingpro.service;

import com.hinditypingpro.dto.TypingTestDto;
import com.hinditypingpro.entity.TypingTest;
import com.hinditypingpro.exception.ResourceNotFoundException;
import com.hinditypingpro.repository.TypingTestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TypingTestService {

    private final TypingTestRepository testRepository;

    public List<TypingTestDto> getAllTests() {
        return testRepository.findAll().stream().map(this::toDto).toList();
    }

    public List<TypingTestDto> getTestsByDifficulty(TypingTest.Difficulty difficulty) {
        return testRepository.findByDifficulty(difficulty).stream().map(this::toDto).toList();
    }

    public TypingTestDto getRandomTest(String difficulty) {
        TypingTest test;
        if (difficulty != null && !difficulty.isBlank()) {
            TypingTest.Difficulty diff = TypingTest.Difficulty.valueOf(difficulty.toUpperCase());
            test = testRepository.findRandomByDifficulty(diff)
                    .orElseThrow(() -> new ResourceNotFoundException("No tests found for difficulty: " + difficulty));
        } else {
            test = testRepository.findRandom()
                    .orElseThrow(() -> new ResourceNotFoundException("No typing tests available"));
        }
        return toDto(test);
    }

    public TypingTestDto getTestById(Long id) {
        TypingTest test = testRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Test not found with id: " + id));
        return toDto(test);
    }

    public TypingTestDto createTest(TypingTestDto dto) {
        TypingTest test = TypingTest.builder()
                .title(dto.getTitle())
                .paragraph(dto.getParagraph())
                .difficulty(dto.getDifficulty())
                .build();
        return toDto(testRepository.save(test));
    }

    public TypingTestDto updateTest(Long id, TypingTestDto dto) {
        TypingTest test = testRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Test not found with id: " + id));
        test.setTitle(dto.getTitle());
        test.setParagraph(dto.getParagraph());
        test.setDifficulty(dto.getDifficulty());
        return toDto(testRepository.save(test));
    }

    public void deleteTest(Long id) {
        if (!testRepository.existsById(id)) {
            throw new ResourceNotFoundException("Test not found with id: " + id);
        }
        testRepository.deleteById(id);
    }

    private TypingTestDto toDto(TypingTest test) {
        return TypingTestDto.builder()
                .id(test.getId())
                .title(test.getTitle())
                .paragraph(test.getParagraph())
                .difficulty(test.getDifficulty())
                .createdAt(test.getCreatedAt())
                .updatedAt(test.getUpdatedAt())
                .build();
    }
}
