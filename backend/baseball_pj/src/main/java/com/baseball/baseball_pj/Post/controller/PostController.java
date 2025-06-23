package com.baseball.baseball_pj.Post.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.baseball.baseball_pj.Post.domain.PostEntity;
import com.baseball.baseball_pj.Post.repository.PostRepository;

@CrossOrigin(origins = "*", allowCredentials = "false")
@RestController
@RequestMapping("/api")
public class PostController {

    @Autowired
    private PostRepository postRepository;

    @PostMapping("/posts")
    public PostEntity createPost(@RequestBody PostEntity postEntity) {
        try {
            return postRepository.save(postEntity);
        } catch (Exception e) {
            e.printStackTrace(); // 콘솔에 에러 로그 출력
            throw e; // 클라이언트에 에러 전달
        }
    }

    // 전체 게시글 조회
    @GetMapping("/posts")
    public List<PostEntity> getAllPosts() {
        return postRepository.findAll();
    }

    @PutMapping("/posts/{id}")
    public ResponseEntity<PostEntity> updatePost(
            @PathVariable Long id,
            @RequestBody PostEntity updatedPost) {
        return postRepository.findById(id)
                .map(post -> {
                    post.setPostTitle(updatedPost.getPostTitle());
                    post.setPostContent(updatedPost.getPostContent());
                    return ResponseEntity.ok(postRepository.save(post));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/posts/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        if (!postRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        postRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}