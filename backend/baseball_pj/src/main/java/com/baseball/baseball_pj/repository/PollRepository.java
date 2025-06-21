package com.baseball.baseball_pj.repository;

import com.baseball.baseball_pj.domain.PollEntity;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

// @Repository
// public interface PollRepository extends JpaRepository<PollEntity, Long> {
//     // 필요하다면 커스텀 쿼리 메서드 추가
//     boolean existsByUserIdAndPlayerIdAndPollId(PollEntity pollId);
// }

public interface PollRepository extends JpaRepository<PollEntity, Long> {
    Optional<PollEntity> findByPollTitle(String pollTitle);
    Optional<PollEntity> findByPollId(Long pollId);
}