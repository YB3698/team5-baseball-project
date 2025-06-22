package com.baseball.baseball_pj.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.baseball.baseball_pj.domain.UserEntity;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
    Optional<UserEntity> findByEmail(String email);
    Optional<UserEntity> findByNickname(String nickname);
    Optional<UserEntity> findById(Long id);

    // ✅ 팀별 유저 수 집계용 Projection
    interface TeamUserCountProjection {
        Long getTeamId();
        Long getUserCount();
    }

    @Query(value = "SELECT u.team_id AS teamId, COUNT(*) AS userCount FROM users u GROUP BY u.team_id", nativeQuery = true)
    List<TeamUserCountProjection> countUsersByTeamId();
}

