package com.baseball.baseball_pj.Vote.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.baseball.baseball_pj.Vote.domain.PollEntity;

import java.util.List;

public interface PollRepository extends JpaRepository<PollEntity, Long> {

    // 활성화된 투표 항목만 가져오기
    List<PollEntity> findByIsActive(String isActive);
    
}
