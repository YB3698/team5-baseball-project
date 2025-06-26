package com.baseball.baseball_pj.Post.DTO;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class UserCommentDto {
    private Long commentId;
    private String content;
    private LocalDateTime createdAt;
    private Long postId; // 항상 포함
    private Long parentId;
    private Long userId;

    public UserCommentDto() {}
    public UserCommentDto(Long commentId, String content, LocalDateTime createdAt, Long postId, Long parentId, Long userId) {
        this.commentId = commentId;
        this.content = content;
        this.createdAt = createdAt;
        this.postId = postId;
        this.parentId = parentId;
        this.userId = userId;
    }
}
