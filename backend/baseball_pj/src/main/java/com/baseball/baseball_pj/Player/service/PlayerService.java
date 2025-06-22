package com.baseball.baseball_pj.Player.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.baseball.baseball_pj.Player.domain.PlayerEntity;
import com.baseball.baseball_pj.Player.repository.PlayerRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PlayerService {

    private final PlayerRepository playerRepository;

    public List<PlayerEntity> getAllPlayers() {
        return playerRepository.findAll();
    }
}
