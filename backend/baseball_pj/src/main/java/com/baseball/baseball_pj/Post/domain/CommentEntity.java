package com.baseball.baseball_pj.Post.domain;

import java.time.LocalDateTime;

import com.baseball.baseball_pj.User.domain.UserEntity;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "COMMENTS")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CommentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "comments_seq_gen")
    @SequenceGenerator(name = "comments_seq_gen", sequenceName = "COMMENTS_SEQ", allocationSize = 1)
    private Long commentId;

    @ManyToOne
    @JoinColumn(name = "post_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private PostEntity post;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private UserEntity user;

    @ManyToOne
    @JoinColumn(name = "parent_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private CommentEntity parent;  // ✅ 대댓글을 위한 자기참조

    @Column(name = "comment_content", columnDefinition = "CLOB")
    private String content;

    @Column(name = "comment_created_at")
    private LocalDateTime createdAt;
}
