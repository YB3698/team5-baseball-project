package com.baseball.baseball_pj.Post.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.baseball.baseball_pj.Post.domain.PostFormEntity;
import com.baseball.baseball_pj.Post.repository.PostRepository;

@Service
public class PostFormService {
    @Autowired
    private PostRepository postRepository;

    public void createPost(PostFormEntity post) {
        postRepository.save(post);
    }

    // 게시글 저장
    public PostFormEntity save(PostFormEntity post) {
        return postRepository.save(post);
    }
}