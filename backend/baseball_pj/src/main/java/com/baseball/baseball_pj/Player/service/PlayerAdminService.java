package com.baseball.baseball_pj.Player.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.baseball.baseball_pj.Player.DTO.PlayerAdminRequestDTO;
import com.baseball.baseball_pj.Player.DTO.PlayerAdminResponseDTO;
import com.baseball.baseball_pj.Player.repository.PlayerRepository;

import lombok.*;

@Service
@RequiredArgsConstructor
public class PlayerAdminService {

    private final PlayerRepository playerRepository;

    // 전체 선수 목록 조회 (관리자용)
    public List<PlayerAdminResponseDTO> getAllPlayers() {
        return playerRepository.findAll().stream()
                .map(player -> PlayerAdminResponseDTO.builder()
                        .playerId(player.getPlayerId())
                        .playerName(player.getPlayerName())
                        .playerPosition(player.getPlayerPosition())
                        .playerBackNumber(player.getPlayerBackNumber() != null ? Long.valueOf(player.getPlayerBackNumber().toString()) : null)
                        .playerBirthDate(player.getPlayerBirthDate() != null ? java.time.LocalDate.parse(player.getPlayerBirthDate()) : null)
                        .playerHeightWeight(player.getPlayerHeightWeight())
                        .playerEducationPath(player.getPlayerEducationPath())
                        .teamId(player.getTeamId() != null ? Long.valueOf(player.getTeamId().toString()) : null)
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
        player.setPlayerBackNumber(dto.getPlayerBackNumber() != null ? dto.getPlayerBackNumber().intValue() : null);
        player.setPlayerBirthDate(dto.getPlayerBirthDate() != null ? dto.getPlayerBirthDate().toString() : null);
        player.setPlayerHeightWeight(dto.getPlayerHeightWeight());
        player.setPlayerEducationPath(dto.getPlayerEducationPath());
        player.setTeamId(dto.getTeamId() != null ? dto.getTeamId().intValue() : null);
        playerRepository.save(player);
        return PlayerAdminResponseDTO.builder()
                .playerId(player.getPlayerId())
                .playerName(player.getPlayerName())
                .playerPosition(player.getPlayerPosition())
                .playerBackNumber(player.getPlayerBackNumber() != null ? Long.valueOf(player.getPlayerBackNumber().toString()) : null)
                .playerBirthDate(player.getPlayerBirthDate() != null ? java.time.LocalDate.parse(player.getPlayerBirthDate()) : null)
                .playerHeightWeight(player.getPlayerHeightWeight())
                .playerEducationPath(player.getPlayerEducationPath())
                .teamId(player.getTeamId() != null ? Long.valueOf(player.getTeamId().toString()) : null)
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
                .playerBackNumber(player.getPlayerBackNumber() != null ? Long.valueOf(player.getPlayerBackNumber().toString()) : null)
                .playerBirthDate(player.getPlayerBirthDate() != null ? java.time.LocalDate.parse(player.getPlayerBirthDate()) : null)
                .playerHeightWeight(player.getPlayerHeightWeight())
                .playerEducationPath(player.getPlayerEducationPath())
                .teamId(player.getTeamId() != null ? Long.valueOf(player.getTeamId().toString()) : null)
                .build();
    }
}