package com.baseball.baseball_pj.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class hittersStatsDto {
    private String playerName;
    private Integer teamId;
    private String teamName; // 팀 이름 추가
    private Double avg;
    private Integer gamesPlayed;
    private Integer plateAppearances;
    private Integer atBats;
    private Integer runs;
    private Integer hits;
    private Integer doubles;
    private Integer triples;
    private Integer homeRuns;
    private Integer totalBases;
    private Integer runsBattedIn;
    private Integer sacrificeHits;
    private Integer sacrificeFlies;

    // 생성자 등 필요한 메서드 추가
}