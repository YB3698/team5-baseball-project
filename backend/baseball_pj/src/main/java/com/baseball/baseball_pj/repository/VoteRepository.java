package com.baseball.baseball_pj.repository;

import com.baseball.baseball_pj.domain.VoteEntity;
import com.baseball.baseball_pj.domain.UserEntity;
import com.baseball.baseball_pj.domain.PlayerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VoteRepository extends JpaRepository<VoteEntity, Long> {
    boolean existsByUserAndPlayerAndPoll(UserEntity user, PlayerEntity player, String poll);
}
