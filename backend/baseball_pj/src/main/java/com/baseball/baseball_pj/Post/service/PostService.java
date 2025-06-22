package com.baseball.baseball_pj.Post.service;

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
}

