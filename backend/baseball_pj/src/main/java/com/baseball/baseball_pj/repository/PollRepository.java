package com.baseball.baseball_pj.repository;

import com.baseball.baseball_pj.domain.PollEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PollRepository extends JpaRepository<PollEntity, Long> {

    // 활성화된 투표 항목만 가져오기
    List<PollEntity> findByIsActive(String isActive);
    
}
