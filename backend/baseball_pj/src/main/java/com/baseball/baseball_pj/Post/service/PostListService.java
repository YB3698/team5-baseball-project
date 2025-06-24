package com.baseball.baseball_pj.Post.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.baseball.baseball_pj.Post.dto.PostListDto;
import com.baseball.baseball_pj.Post.domain.PostEntity;
import com.baseball.baseball_pj.Post.repository.PostRepository;

@Service
public class PostListService {
    @Autowired
    private PostRepository postRepository;

    public void createPost(PostEntity post) {
        postRepository.save(post);
    }

    // 전체 게시글 조회 - 닉네임 및 유저 ID 포함 DTO 반환
    @Transactional(readOnly = true)
    public List<PostListDto> getAllPostDtos() {
        List<PostEntity> entities = postRepository.findAll();
        return entities.stream().map(e -> {
            PostListDto dto = new PostListDto();
            dto.setPostId(e.getPostId());
            dto.setPostTitle(e.getPostTitle());
            dto.setPostContent(e.getPostContent());
            dto.setPostCreatedAt(e.getPostCreatedAt() != null ? e.getPostCreatedAt().toString() : null);
            dto.setTeamId(e.getTeamId());
            if (e.getUser() != null) {
                dto.setNickname(e.getUser().getNickname()); // 닉네임
                dto.setUserId(e.getUser().getId()); // ❗이 줄 반드시 필요
            }
            return dto;
        }).collect(Collectors.toList());
    }

    public List<PostEntity> findAll() {
        return postRepository.findAll();
    }
}
