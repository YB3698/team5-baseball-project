package com.baseball.baseball_pj.repository;

import com.baseball.baseball_pj.domain.VoteEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VoteRepository extends JpaRepository<VoteEntity, Long> {

    Optional<VoteEntity> findByUser_IdAndPoll_PollId(Long userId, Long pollId);
    List<VoteEntity> findByPoll_PollId(Long pollId);
    void deleteByPoll_PollId(Long pollId);

}
