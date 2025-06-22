package com.baseball.baseball_pj.domain;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "POLLS")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PollEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "poll_seq_gen")
    @SequenceGenerator(name = "poll_seq_gen", sequenceName = "SEQ_POLLS", allocationSize = 1)
    @Column(name = "POLL_ID")
    private Long pollId; // id → pollId

    @Column(name = "POLL_TITLE", nullable = false)
    private String pollTitle; // question → pollTitle

    @Column(name = "START_DATE")
    private LocalDate startDate;

    @Column(name = "END_DATE")
    private LocalDate endDate;

    @Column(name = "IS_ACTIVE")
    private String isActive;

    @OneToMany(mappedBy = "poll")
    private List<VoteEntity> votes;

    @OneToMany(mappedBy = "poll", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<VoteOptionEntity> options;

    
}
