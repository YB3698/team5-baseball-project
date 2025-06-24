package com.baseball.baseball_pj.Post.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.baseball.baseball_pj.Post.domain.PostEntity;
import com.baseball.baseball_pj.Post.repository.PostRepository;
import com.baseball.baseball_pj.Post.DTO.PostWithNicknameDto;
import com.baseball.baseball_pj.User.repository.UserRepository;

@CrossOrigin(origins = "*", allowCredentials = "false")
@RestController
@RequestMapping("/api")
public class PostController {

    @Autowired
    private PostRepository postRepository;
    @Autowired
    private UserRepository userRepository;

    // 게시글 저장
    @PostMapping("/posts")
    public PostEntity createPost(@RequestBody PostEntity postEntity) {
        try {
            return postRepository.save(postEntity);
        } catch (Exception e) {
            e.printStackTrace(); // 콘솔에 에러 로그 출력
            throw e; // 클라이언트에 에러 전달
        }
    }

    // 전체 게시글 조회 (작성자 닉네임 포함)
    @GetMapping("/posts")
    public List<PostWithNicknameDto> getAllPosts() {
        List<PostEntity> posts = postRepository.findAll();
        return posts.stream().map(post -> {
            String nickname = userRepository.findById(post.getUserId())
                    .map(user -> user.getNickname())
                    .orElse("알 수 없음");
            return new PostWithNicknameDto(
                    post.getPostId(),
                    post.getUserId(),
                    post.getTeamId(),
                    post.getPostTitle(), post.getPostContent(),
                    post.getPostCreatedAt(),
                    nickname,
                    post.getViewCount());
        }).collect(Collectors.toList());
    }

    // 특정 게시글 조회 (조회수 증가)
    @GetMapping("/posts/{id}")
    public ResponseEntity<PostWithNicknameDto> getPost(@PathVariable Long id) {
        return postRepository.findById(id)
                .map(post -> {
                    // 조회수 증가
                    post.setViewCount(post.getViewCount() + 1);
                    postRepository.save(post);

                    // 닉네임 조회
                    String nickname = userRepository.findById(post.getUserId())
                            .map(user -> user.getNickname())
                            .orElse("알 수 없음");

                    PostWithNicknameDto dto = new PostWithNicknameDto(
                            post.getPostId(),
                            post.getUserId(),
                            post.getTeamId(),
                            post.getPostTitle(),
                            post.getPostContent(),
                            post.getPostCreatedAt(),
                            nickname,
                            post.getViewCount());

                    return ResponseEntity.ok(dto);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 게시글 수정
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

    // 게시글 삭제
    @DeleteMapping("/posts/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        if (!postRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        postRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}