package com.baseball.baseball_pj.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.baseball.baseball_pj.domain.TeamEntity;
import com.baseball.baseball_pj.repository.TeamRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository TeamRepository;

    public List<TeamEntity> getAllTeams() {
        return TeamRepository.findAll();
    }
}
