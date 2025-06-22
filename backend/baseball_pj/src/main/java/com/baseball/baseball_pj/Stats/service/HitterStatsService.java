package com.baseball.baseball_pj.Stats.service;

import com.baseball.baseball_pj.Stats.DTO.hittersStatsDto;
import com.baseball.baseball_pj.Stats.domain.hitterstatsentity;
import com.baseball.baseball_pj.Stats.repository.hitterstatsrepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class HitterStatsService {

    private final hitterstatsrepository hitterStatsRepository;

    public HitterStatsService(hitterstatsrepository hitterStatsRepository) {
        this.hitterStatsRepository = hitterStatsRepository;
    }

    public List<hittersStatsDto> getHitterStatsDtos(Integer year) {
        List<hitterstatsentity> entities = hitterStatsRepository.findByYearOrderByAvgDesc(year);
        return entities.stream().map(e -> {
            hittersStatsDto dto = new hittersStatsDto();
            dto.setPlayerName(e.getPlayerName());
            dto.setTeamId(e.getTeamId());
            dto.setTeamName(e.getTeam() != null ? e.getTeam().getTeamName() : null);
            dto.setAvg(e.getAvg());
            dto.setGamesPlayed(e.getGamesPlayed());
            dto.setPlateAppearances(e.getPlateAppearances());
            dto.setAtBats(e.getAtBats());
            dto.setRuns(e.getRuns());
            dto.setHits(e.getHits());
            dto.setDoubles(e.getDoubles());
            dto.setTriples(e.getTriples());
            dto.setHomeRuns(e.getHomeRuns());
            dto.setTotalBases(e.getTotalBases());
            dto.setRunsBattedIn(e.getRunsBattedIn());
            dto.setSacrificeHits(e.getSacrificeHits());
            dto.setSacrificeFlies(e.getSacrificeFlies());
            return dto;
        }).collect(Collectors.toList());
    }
}