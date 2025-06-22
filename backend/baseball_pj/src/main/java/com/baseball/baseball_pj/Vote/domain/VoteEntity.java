package com.baseball.baseball_pj.Vote.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

import com.baseball.baseball_pj.User.domain.UserEntity;

@Entity
@Table(name = "VOTE", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"USER_ID", "POLL_ID"})
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class VoteEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "VOTE_ID")
    private Long voteId;

    @ManyToOne
    @JoinColumn(name = "USER_ID")
    private UserEntity user;

    @ManyToOne
    @JoinColumn(name = "POLL_ID")
    private PollEntity poll;

    @ManyToOne
    @JoinColumn(name = "OPTION_ID")
    private VoteOptionEntity option;

    @Column(name = "VOTED_AT")
    private LocalDateTime votedAt;
}
