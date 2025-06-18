package com.baseball.baseball_pj.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.baseball.baseball_pj.domain.PlayerEntity;
import com.baseball.baseball_pj.service.PlayerService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PlayerController {

    private final PlayerService playerService;

    @GetMapping("/players")
    public List<PlayerEntity> getAllPlayers() {
        return playerService.getAllPlayers(); // DTO 없이 Entity 그대로 반환
    }
}
