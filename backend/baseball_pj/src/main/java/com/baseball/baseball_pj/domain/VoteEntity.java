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
    private UserEntity user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "player_id", referencedColumnName = "player_id")
    private PlayerEntity player;

    @Column(name = "poll")
    private String poll;

    @Column(name = "voted_at")
    private LocalDateTime votedAt;
}
