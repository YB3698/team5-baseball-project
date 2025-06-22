package com.baseball.baseball_pj.User.service;

import com.baseball.baseball_pj.User.repository.UserRepository;
import com.baseball.baseball_pj.Team.repository.TeamRepository;
import com.baseball.baseball_pj.Team.domain.TeamEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.baseball.baseball_pj.User.DTO.UserAdminResponseDTO;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service // 비즈니스 로직을 담당하는 서비스 클래스임을 spring에 알림
@RequiredArgsConstructor // final로 선언된 필드를 자동으로 생성자에 주입
public class UserService {

    private final UserRepository userRepository; // 사용자 DB 접근을 위한 리포지토리
    private final TeamRepository teamRepository; // 팀 DB 접근을 위한 리포지토리

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
                            "teamLogo", team != null ? team.getTeamLogo() : null);
                })
                .collect(Collectors.toList());
    }

    // ✅ 전체 회원 목록 조회 (관리자용)
    public List<UserAdminResponseDTO> getAllUsers() {
        return userRepository.findAll().stream() // 모든 사용자 엔티티를 조회
                // UserEntity → UserAdminResponseDTO 변환(엔티티 직접 노출 하지 않고 필요한 정보만 반환)
                .map(user -> UserAdminResponseDTO.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .nickname(user.getNickname())
                        .favoriteTeamId(user.getFavoriteTeamId())
                        .role(user.getRole())
                        .createdAt(user.getCreatedAt() != null ? user.getCreatedAt().toLocalDate() : null)
                        .build())
                .collect(Collectors.toList()); // 모든 DTO를 리스트로 반환
    }

    // 회원 정보 수정
    public UserAdminResponseDTO updateUser(Long userId, UserAdminResponseDTO dto) {
        var userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty())
            throw new IllegalArgumentException("존재하지 않는 회원입니다.");
        var user = userOpt.get();
        user.setEmail(dto.getEmail());
        user.setNickname(dto.getNickname());
        user.setFavoriteTeamId(dto.getFavoriteTeamId());
        user.setRole(dto.getRole());
        userRepository.save(user);
        return UserAdminResponseDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .favoriteTeamId(user.getFavoriteTeamId())
                .role(user.getRole())
                .createdAt(user.getCreatedAt() != null ? user.getCreatedAt().toLocalDate() : null)
                .build();
    }

    // 회원 삭제
    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }

    // 단일 회원 조회
    public UserAdminResponseDTO getUser(Long userId) {
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));
        return UserAdminResponseDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .favoriteTeamId(user.getFavoriteTeamId())
                .role(user.getRole())
                .createdAt(user.getCreatedAt() != null ? user.getCreatedAt().toLocalDate() : null)
                .build();
    }
}
