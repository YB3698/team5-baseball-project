package com.baseball.baseball_pj.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "VOTES")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VoteEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vote_id")
    private Long voteId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    private UserEntity userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "player_id", referencedColumnName = "player_id")
    private PlayerEntity playerId;

    @Column(name = "poll_id")
    private PollEntity pollId;

    @Column(name = "voted_at")
    private LocalDateTime votedAt;

    @Column(name = "voted_name")
    private LocalDateTime votedName;
}
