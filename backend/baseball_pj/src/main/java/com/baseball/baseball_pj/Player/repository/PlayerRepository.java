package com.baseball.baseball_pj.Player.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.baseball.baseball_pj.Player.domain.PlayerEntity;

@Repository
public interface PlayerRepository extends JpaRepository<PlayerEntity, Long> {
    // 별도 메서드 없어도 전체 조회 가능
}
