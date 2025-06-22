package com.baseball.baseball_pj.Post.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "POSTS")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "posts_seq_gen")
    @SequenceGenerator(name = "posts_seq_gen", sequenceName = "POSTS_SEQ", allocationSize = 1)
    @Column(name = "POST_ID")
    private Long postId;

    @Column(name = "USER_ID")
    private Long userId;

    @Column(name = "TEAM_ID")
    private Integer teamId;

    @Column(name = "POST_TITLE")
    private String postTitle;

    @Column(name = "POST_CONTENT")
    private String postContent;

    @Builder.Default
    @Column(name = "POST_CREATED_AT")
    private LocalDateTime postCreatedAt = LocalDateTime.now();
}