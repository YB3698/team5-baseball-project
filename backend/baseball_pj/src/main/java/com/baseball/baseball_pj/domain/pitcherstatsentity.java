package com.baseball.baseball_pj.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "PITCHER_STATS")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class pitcherstatsentity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "pitcher_stats_seq_gen")
    @SequenceGenerator(name = "pitcher_stats_seq_gen", sequenceName = "SEQ_PITCHER_STATS", allocationSize = 1)
    @Column(name = "PITCHER_STATS_ID")
    private Long id;

    @Column(name = "TEAM_ID")
    private Integer teamId;

    @Column(name = "PITCHER_STATS_YEAR")
    private Integer year;

    @Column(name = "PLAYER_NAME")
    private String playerName;

    @Column(name = "PITCHER_STATS_ERA")
    private Double era;

    @Column(name = "PITCHER_STATS_G")
    private Integer gamesPlayed;

    @Column(name = "PITCHER_STATS_W")
    private Integer wins;

    @Column(name = "PITCHER_STATS_L")
    private Integer losses;

    @Column(name = "PITCHER_STATS_SV")
    private Integer saves;

    @Column(name = "PITCHER_STATS_HLD")
    private Integer holds;

    @Column(name = "PITCHER_STATS_WPCT")
    private Double winPercentage;

    @Column(name = "PITCHER_STATS_IP")
    private String inningsPitched;

    @Column(name = "PITCHER_STATS_H")
    private Integer hitsAllowed;

    @Column(name = "PITCHER_STATS_HR")
    private Integer homeRunsAllowed;

    @Column(name = "PITCHER_STATS_BB")
    private Integer walksAllowed;

    @Column(name = "PITCHER_STATS_HBP")
    private Integer hitByPitch;

    @Column(name = "PITCHER_STATS_SO")
    private Integer strikeouts;

    @Column(name = "PITCHER_STATS_R")
    private Integer earnedRuns;

    @Column(name = "PITCHER_STATS_ER")
    private Integer earnedRunsAllowed;

    @Column(name = "PITCHER_STATS_WHIP")
    private Double whip;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "TEAM_ID", insertable = false, updatable = false)
    private TeamEntity team;
}
