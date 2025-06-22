package com.baseball.baseball_pj.Vote.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.baseball.baseball_pj.Vote.domain.PollEntity;
import com.baseball.baseball_pj.Vote.domain.VoteOptionEntity;

import java.util.List;

public interface VoteOptionRepository extends JpaRepository<VoteOptionEntity, Long> {

    // 특정 투표 항목(POLL)에 속한 모든 옵션(선택지) 조회
    List<VoteOptionEntity> findByPoll(PollEntity poll);

    // 또는 ID만으로도 조회 가능
    List<VoteOptionEntity> findByPoll_PollId(Long pollId);

    void deleteByPoll_PollId(Long pollId);
}
