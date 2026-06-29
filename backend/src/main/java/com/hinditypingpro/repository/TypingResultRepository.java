package com.hinditypingpro.repository;

import com.hinditypingpro.entity.TypingResult;
import com.hinditypingpro.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TypingResultRepository extends JpaRepository<TypingResult, Long> {

    List<TypingResult> findByUserOrderByCreatedAtDesc(User user);

    @Query("SELECT r FROM TypingResult r ORDER BY r.speed DESC")
    List<TypingResult> findTopBySpeed();

    @Query("SELECT r FROM TypingResult r ORDER BY r.accuracy DESC")
    List<TypingResult> findTopByAccuracy();

    @Query("""
        SELECT r FROM TypingResult r
        WHERE r.user.id = :userId
        ORDER BY r.createdAt DESC
    """)
    List<TypingResult> findByUserId(Long userId);

    @Query("""
        SELECT DISTINCT r FROM TypingResult r
        ORDER BY r.speed DESC
        LIMIT 50
    """)
    List<TypingResult> findLeaderboardBySpeed();

    @Query("""
        SELECT DISTINCT r FROM TypingResult r
        ORDER BY r.accuracy DESC
        LIMIT 50
    """)
    List<TypingResult> findLeaderboardByAccuracy();
}
