package com.baseball.baseball_pj.Post.domain;

import com.baseball.baseball_pj.User.domain.UserEntity;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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

    @Builder.Default
    @Column(name = "VIEW_COUNT")
    private Long viewCount = 0L;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_ID", insertable = false, updatable = false)
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private UserEntity user;
}