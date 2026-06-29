package com.hinditypingpro.repository;

import com.hinditypingpro.entity.TypingTest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TypingTestRepository extends JpaRepository<TypingTest, Long> {
    List<TypingTest> findByDifficulty(TypingTest.Difficulty difficulty);

    @Query(value = "SELECT * FROM typing_tests WHERE difficulty = :#{#difficulty.name()} ORDER BY RANDOM() LIMIT 1", nativeQuery = true)
    Optional<TypingTest> findRandomByDifficulty(TypingTest.Difficulty difficulty);

    @Query(value = "SELECT * FROM typing_tests ORDER BY RANDOM() LIMIT 1", nativeQuery = true)
    Optional<TypingTest> findRandom();
}
