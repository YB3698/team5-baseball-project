package com.baseball.baseball_pj.Post.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostWithNicknameDto {
    private Long postId;
    private Long userId;
    private Integer teamId;
    private String postTitle;
    private String postContent;
    private LocalDateTime postCreatedAt;
    private String nickname;
}
