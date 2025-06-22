package com.baseball.baseball_pj.Team.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.baseball.baseball_pj.Team.domain.TeamEntity;
import com.baseball.baseball_pj.Team.service.TeamService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class TeamController {

    private final TeamService TeamService;

    @GetMapping("/teams")
    public List<TeamEntity> getAllTeams() {
        return TeamService.getAllTeams(); // DTO 없이 Entity 그대로 반환
    }
}