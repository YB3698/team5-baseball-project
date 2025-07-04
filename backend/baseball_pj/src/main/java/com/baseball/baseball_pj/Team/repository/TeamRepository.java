package com.baseball.baseball_pj.Team.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.baseball.baseball_pj.Team.domain.TeamEntity;

@Repository
public interface TeamRepository extends JpaRepository<TeamEntity, Long> {
    // 별도 메서드 없어도 전체 조회 가능
}
