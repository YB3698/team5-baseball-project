package com.baseball.baseball_pj.Team.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.baseball.baseball_pj.Team.domain.TeamEntity;
import com.baseball.baseball_pj.Team.repository.TeamRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository TeamRepository;

    public List<TeamEntity> getAllTeams() {
        return TeamRepository.findAll();
    }
}
