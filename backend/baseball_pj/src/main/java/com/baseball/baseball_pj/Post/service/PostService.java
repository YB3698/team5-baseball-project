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
}