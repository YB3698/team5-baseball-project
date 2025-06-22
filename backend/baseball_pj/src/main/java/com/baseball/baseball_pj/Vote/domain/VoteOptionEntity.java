package com.baseball.baseball_pj.Vote.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "VOTE_OPTIONS")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder 
public class VoteOptionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "OPTION_ID")
    private Long optionId;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "POLL_ID")
    private PollEntity poll;

    @Column(name = "DESCRIPTION")
    private String description;
}
