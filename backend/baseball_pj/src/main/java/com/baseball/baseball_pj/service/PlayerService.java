package com.baseball.baseball_pj.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.baseball.baseball_pj.domain.PlayerEntity;
import com.baseball.baseball_pj.repository.PlayerRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PlayerService {

    private final PlayerRepository playerRepository;

    public List<PlayerEntity> getAllPlayers() {
        return playerRepository.findAll();
    }
}
