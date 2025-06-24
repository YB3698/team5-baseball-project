package com.baseball.baseball_pj.Post.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PostListDto {
    private Long postId;
    private Long userId;
    private Integer teamId;
    private String postTitle;
    private String postContent;
    private String postCreatedAt;
    private String nickname;
    private Long viewCount;
}
