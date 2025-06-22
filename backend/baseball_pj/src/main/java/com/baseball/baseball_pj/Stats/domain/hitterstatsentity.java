package com.baseball.baseball_pj.Stats.domain;

import com.baseball.baseball_pj.Team.domain.TeamEntity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "HITTER_STATS")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class hitterstatsentity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "hitter_stats_seq_gen")
    @SequenceGenerator(name = "hitter_stats_seq_gen", sequenceName = "SEQ_HITTER_STATS", allocationSize = 1)
    @Column(name = "HITTER_STATS_ID")
    private Long id;

    @Column(name = "TEAM_ID")
    private Integer teamId;

    @Column(name = "HITTER_STATS_YEAR")
    private Integer year;

    @Column(name = "PLAYER_NAME")
    private String playerName;

    @Column(name = "HITTER_STATS_AVG")
    private Double avg;

    @Column(name = "HITTER_STATS_G")
    private Integer gamesPlayed;

    @Column(name = "HITTER_STATS_PA")
    private Integer plateAppearances;

    @Column(name = "HITTER_STATS_AB")
    private Integer atBats;

    @Column(name = "HITTER_STATS_R")
    private Integer runs;

    @Column(name = "HITTER_STATS_H")
    private Integer hits;

    @Column(name = "HITTER_STATS_2B")
    private Integer doubles;

    @Column(name = "HITTER_STATS_3B")
    private Integer triples;

    @Column(name = "HITTER_STATS_HR")
    private Integer homeRuns;

    @Column(name = "HITTER_STATS_TB")
    private Integer totalBases;

    @Column(name = "HITTER_STATS_RBI")
    private Integer runsBattedIn;

    @Column(name = "HITTER_STATS_SAC")
    private Integer sacrificeHits;

    @Column(name = "HITTER_STATS_SF")
    private Integer sacrificeFlies;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "TEAM_ID", insertable = false, updatable = false)
    private TeamEntity team;
}
