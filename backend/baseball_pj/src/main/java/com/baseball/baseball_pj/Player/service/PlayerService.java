package com.baseball.baseball_pj.Player.service;

import com.baseball.baseball_pj.Player.repository.PlayerRepository;
import com.baseball.baseball_pj.Team.domain.TeamEntity;
import com.baseball.baseball_pj.Player.domain.PlayerEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.baseball.baseball_pj.Player.DTO.PlayerAdminResponseDTO;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlayerService {

    private final PlayerRepository playerRepository;

    public List<PlayerEntity> getAllPlayersEntity() {
        return playerRepository.findAll();
    }
}
