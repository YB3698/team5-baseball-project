package com.baseball.baseball_pj.service;

import com.baseball.baseball_pj.DTO.pitcherStatsDto;
import com.baseball.baseball_pj.domain.pitcherstatsentity;
import com.baseball.baseball_pj.repository.pitcherstatsrepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PitcherStatsService {
    private final pitcherstatsrepository pitcherStatsRepository;

    public PitcherStatsService(pitcherstatsrepository pitcherStatsRepository) {
        this.pitcherStatsRepository = pitcherStatsRepository;
    }

    public List<pitcherStatsDto> getPitcherStatsDtos(Integer year) {
        List<pitcherstatsentity> entities = pitcherStatsRepository.findByYearOrderByEraAsc(year);
        return entities.stream().map(e -> {
            pitcherStatsDto dto = new pitcherStatsDto();
            dto.setPlayerName(e.getPlayerName());
            dto.setTeamId(e.getTeamId());
            dto.setTeamName(e.getTeam() != null ? e.getTeam().getTeamName() : null);
            dto.setEra(e.getEra());
            dto.setGamesPlayed(e.getGamesPlayed());
            dto.setWins(e.getWins());
            dto.setLosses(e.getLosses());
            dto.setSaves(e.getSaves());
            dto.setHolds(e.getHolds());
            dto.setWinPercentage(e.getWinPercentage());
            dto.setInningsPitched(e.getInningsPitched());
            dto.setHitsAllowed(e.getHitsAllowed());
            dto.setHomeRunsAllowed(e.getHomeRunsAllowed());
            dto.setWalksAllowed(e.getWalksAllowed());
            dto.setHitByPitch(e.getHitByPitch());
            dto.setStrikeouts(e.getStrikeouts());
            dto.setEarnedRuns(e.getEarnedRuns());
            dto.setEarnedRunsAllowed(e.getEarnedRunsAllowed());
            dto.setWhip(e.getWhip());
            dto.setId(e.getId());

            return dto;
        }).collect(Collectors.toList());
    }

}
