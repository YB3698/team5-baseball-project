package com.baseball.baseball_pj.Player.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.baseball.baseball_pj.Player.DTO.PlayerAdminRequestDTO;
import com.baseball.baseball_pj.Player.DTO.PlayerAdminResponseDTO;
import com.baseball.baseball_pj.Player.domain.PlayerEntity;
import com.baseball.baseball_pj.Player.repository.PlayerRepository;

import lombok.*;

@Service
@RequiredArgsConstructor
public class PlayerAdminService {

    private final PlayerRepository playerRepository;

    // 선수 추가
    public PlayerAdminResponseDTO addPlayer(PlayerAdminRequestDTO dto) {
        PlayerEntity player = PlayerEntity.builder()
                .playerName(dto.getPlayerName())
                .playerPosition(dto.getPlayerPosition())
                .playerBackNumber(dto.getPlayerBackNumber())
                .playerBirthDate(dto.getPlayerBirthDate()) // LocalDate 타입이면 그대로 사용
                .playerHeightWeight(dto.getPlayerHeightWeight())
                .playerEducationPath(dto.getPlayerEducationPath())
                .teamId(dto.getTeamId())
                .build();

        playerRepository.save(player);

        return PlayerAdminResponseDTO.builder()
                .playerId(player.getPlayerId())
                .playerName(player.getPlayerName())
                .playerPosition(player.getPlayerPosition())
                .playerBackNumber(player.getPlayerBackNumber())
                .playerBirthDate(player.getPlayerBirthDate()) // LocalDate 그대로 반환
                .playerHeightWeight(player.getPlayerHeightWeight())
                .playerEducationPath(player.getPlayerEducationPath())
                .teamId(player.getTeamId())
                .build();
    }

    // 전체 선수 목록 조회 (관리자용)
    public List<PlayerAdminResponseDTO> getAllPlayers() {
        return playerRepository.findAll().stream()
                .map(player -> PlayerAdminResponseDTO.builder()
                        .playerId(player.getPlayerId())
                        .playerName(player.getPlayerName())
                        .playerPosition(player.getPlayerPosition())
                        .playerBackNumber(player.getPlayerBackNumber())
                        .playerBirthDate(player.getPlayerBirthDate())
                        .playerHeightWeight(player.getPlayerHeightWeight())
                        .playerEducationPath(player.getPlayerEducationPath())
                        .teamId(player.getTeamId())
                        .build())
                .toList();
    }

    // 선수 정보 수정
    public PlayerAdminResponseDTO updatePlayer(Long playerId, PlayerAdminRequestDTO dto) {
        var playerOpt = playerRepository.findById(playerId);
        if (playerOpt.isEmpty())
            throw new IllegalArgumentException("존재하지 않는 선수입니다.");
        var player = playerOpt.get();
        player.setPlayerName(dto.getPlayerName());
        player.setPlayerPosition(dto.getPlayerPosition());
        player.setPlayerBackNumber(dto.getPlayerBackNumber());
        player.setPlayerBirthDate(dto.getPlayerBirthDate());
        player.setPlayerHeightWeight(dto.getPlayerHeightWeight());
        player.setPlayerEducationPath(dto.getPlayerEducationPath());
        player.setTeamId(dto.getTeamId());
        playerRepository.save(player);
        return PlayerAdminResponseDTO.builder()
                .playerId(player.getPlayerId())
                .playerName(player.getPlayerName())
                .playerPosition(player.getPlayerPosition())
                .playerBackNumber(player.getPlayerBackNumber())
                .playerBirthDate(player.getPlayerBirthDate())
                .playerHeightWeight(player.getPlayerHeightWeight())
                .playerEducationPath(player.getPlayerEducationPath())
                .teamId(player.getTeamId())
                .build();
    }

    // 선수 삭제
    public void deletePlayer(Long playerId) {
        playerRepository.deleteById(playerId);
    }

    // 단일 선수 조회
    public PlayerAdminResponseDTO getPlayer(Long playerId) {
        var player = playerRepository.findById(playerId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 선수입니다."));
        return PlayerAdminResponseDTO.builder()
                .playerId(player.getPlayerId())
                .playerName(player.getPlayerName())
                .playerPosition(player.getPlayerPosition())
                .playerBackNumber(player.getPlayerBackNumber())
                .playerBirthDate(player.getPlayerBirthDate())
                .playerHeightWeight(player.getPlayerHeightWeight())
                .playerEducationPath(player.getPlayerEducationPath())
                .teamId(player.getTeamId())
                .build();
    }

    // // 아래에 유틸 메서드 추가
    // private java.time.LocalDate parseDate(String dateStr) {
    //     if (dateStr == null) return null;
    //     String onlyDate = dateStr.split(" ")[0]; // 공백 기준 앞부분만 추출
    //     return java.time.LocalDate.parse(onlyDate);
    // }
}