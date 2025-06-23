package com.baseball.baseball_pj.Post.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.baseball.baseball_pj.Post.DTO.PostListDto;
import com.baseball.baseball_pj.Post.domain.PostFormEntity;
import com.baseball.baseball_pj.Post.repository.PostRepository;

@Service
public class PostListService {
    @Autowired
    private PostRepository postRepository;

    public void createPost(PostFormEntity post) {
        postRepository.save(post);
    }

    // 전체 게시글 조회 - 닉네임 포함 DTO 반환
    public List<PostListDto> getAllPostDtos() {
        List<PostFormEntity> entities = postRepository.findAll();
        return entities.stream().map(e -> {
            PostListDto dto = new PostListDto();
            dto.setPostId(e.getPostId());
            dto.setPostTitle(e.getPostTitle());
            dto.setPostContent(e.getPostContent());
            dto.setPostCreatedAt(e.getPostCreatedAt() != null ? e.getPostCreatedAt().toString() : null);
            dto.setTeamId(e.getTeamId());
            dto.setNickname(e.getUser() != null ? e.getUser().getNickname() : null);
            // dto.setViews(e.getViews() != null ? e.getViews() : 0);
            return dto;
        }).collect(Collectors.toList());
    }

    // 기존 메서드도 유지
    public List<PostFormEntity> findAll() {
        return postRepository.findAll();
    }
}