package com.baseball.baseball_pj.repository;

import com.baseball.baseball_pj.domain.VoteEntity;
import com.baseball.baseball_pj.domain.UserEntity;
import com.baseball.baseball_pj.domain.PollEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VoteRepository extends JpaRepository<VoteEntity, Long> {
    // 투표 여부 확인을 위한 메서드
    boolean existsByUserIdAndPollId(UserEntity userId, PollEntity pollId);
}
