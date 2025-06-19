package com.baseball.baseball_pj.domain;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "GAMES")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ScheduleEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "game_seq_gen")
    @SequenceGenerator(name = "game_seq_gen", sequenceName = "SEQ_GAMES", allocationSize = 1)
    @Column(name = "GAME_ID")
    private Long id;

    @Column(name = "GAME_DATE")
    private LocalDateTime gameDate;

    @Column(name = "HOME_TEAM_NAME")
    private String homeTeamName;

    @Column(name = "AWAY_TEAM_NAME")
    private String awayTeamName;

    @Column(name = "HOME_SCORE")
    private Integer homeScore;

    @Column(name = "AWAY_SCORE")
    private Integer awayScore;

    @Column(name = "STADIUM")
    private String stadium;

    @Column(name = "IS_RAINED_OUT")
    private String isRainedOut;
}
