package com.baseball.baseball_pj.Vote.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.baseball.baseball_pj.Vote.domain.VoteEntity;

import java.util.List;
import java.util.Optional;

public interface VoteRepository extends JpaRepository<VoteEntity, Long> {

    Optional<VoteEntity> findByUser_IdAndPoll_PollId(Long userId, Long pollId);
    List<VoteEntity> findByPoll_PollId(Long pollId);
    void deleteByPoll_PollId(Long pollId);

}
