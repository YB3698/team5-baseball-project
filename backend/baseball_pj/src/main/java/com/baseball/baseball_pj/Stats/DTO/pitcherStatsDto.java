package com.baseball.baseball_pj.Stats.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class pitcherStatsDto {
    private Long id;
    private Integer teamId;
    private String teamName;
    private Integer year;
    private String playerName;
    private Double era;
    private Integer gamesPlayed;
    private Integer wins;
    private Integer losses;
    private Integer saves;
    private Integer holds;
    private Double winPercentage;
    private String inningsPitched;
    private Integer hitsAllowed;
    private Integer homeRunsAllowed;
    private Integer walksAllowed;
    private Integer hitByPitch;
    private Integer strikeouts;
    private Integer earnedRuns;
    private Integer earnedRunsAllowed;
    private Double whip;
}