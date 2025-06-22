package com.baseball.baseball_pj.service;

import com.baseball.baseball_pj.repository.UserRepository;
import com.baseball.baseball_pj.repository.TeamRepository;
import com.baseball.baseball_pj.domain.TeamEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final TeamRepository teamRepository;

    // ✅ 팀별 유저 수 조회 (DB에서 팀명 매핑)
    public List<Map<String, Object>> getUserCountByTeam() {
        // 1. 팀 id → 팀명/로고 매핑을 DB에서 조회
        Map<Long, TeamEntity> teamMap = teamRepository.findAll().stream()
            .collect(Collectors.toMap(TeamEntity::getTeamId, t -> t));
        // 2. 집계 쿼리 실행
        List<UserRepository.TeamUserCountProjection> raw = userRepository.countUsersByTeamId();
        // 3. 결과 변환 (teamName, userCount, teamLogo)
        return raw.stream()
            .map(p -> {
                TeamEntity team = teamMap.get(p.getTeamId());
                return Map.<String, Object>of(
                    "teamName", team != null ? team.getTeamName() : "알수없음",
                    "userCount", p.getUserCount(),
                    "teamLogo", team != null ? team.getTeamLogo() : null
                );
            })
            .collect(Collectors.toList());
    }
}
