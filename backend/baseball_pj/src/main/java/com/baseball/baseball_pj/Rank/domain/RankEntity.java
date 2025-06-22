package com.baseball.baseball_pj.Rank.domain;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "TEAM_DAILY_RANKINGS")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RankEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "team_name")
    private String teamName;

    @Column(name = "games_played")
    private Integer gamesPlayed;

    @Column(name = "wins")
    private Integer wins;

    @Column(name = "draws")
    private Integer draws;

    @Column(name = "losses")
    private Integer losses;

    @Column(name = "win_rate")
    private Double winRate;

    @Column(name = "runs_scored")
    private Integer runsScored;

    @Column(name = "runs_allowed")
    private Integer runsAllowed;

    @Column(name = "pyth_win_rate")
    private Double pythWinRate;

    @Column(name = "pyth_wins")
    private Double pythWins;

    @Column(name = "pyth_rank")
    private Integer pythRank;

    @Column(name = "real_rank")
    private Integer realRank;

    @Column(name = "rank_diff")
    private Integer rankDiff;

    @Column(name = "record_date")
    private LocalDate recordDate;
}
