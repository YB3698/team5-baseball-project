package com.baseball.baseball_pj.Post.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.baseball.baseball_pj.Post.domain.PostEntity;
import com.baseball.baseball_pj.Post.repository.PostRepository;

@Service
public class PostService {
    @Autowired
    private PostRepository postRepository;

    public void createPost(PostEntity post) {
        postRepository.save(post);
    }

    // 전체 게시글 조회
    public List<PostEntity> findAll() {
        return postRepository.findAll();
    }

    // PostService.java
    public PostEntity save(PostEntity post) {
        return postRepository.save(post);
    }

    // 특정 게시글 조회 (조회수 증가 없이)
    public PostEntity findById(Long id) {
        return postRepository.findById(id).orElse(null);
    }

    // 조회수 증가
    public void incrementViewCount(Long postId) {
        postRepository.findById(postId).ifPresent(post -> {
            post.setViewCount(post.getViewCount() + 1);
            postRepository.save(post);
        });
    }
}