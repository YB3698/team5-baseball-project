package com.baseball.baseball_pj.Post.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.baseball.baseball_pj.Post.DTO.PostListDto;
import com.baseball.baseball_pj.Post.domain.PostFormEntity;
import com.baseball.baseball_pj.Post.repository.PostRepository;
import com.baseball.baseball_pj.Post.service.PostListService;
import com.baseball.baseball_pj.User.domain.UserEntity;
import com.baseball.baseball_pj.User.repository.UserRepository;

@CrossOrigin(origins = "*", allowCredentials = "false")
@RestController
@RequestMapping("/api")
public class PostController {

    @Autowired
    private PostRepository postRepository;
    @Autowired
    private UserRepository userRepository; // UserRepository 추가
    private final PostListService postListService;

    public PostController(PostListService postListService) {
        this.postListService = postListService;
    }

    // 게시글 저장
    @PostMapping("/posts")
    public PostFormEntity createPost(@RequestBody PostFormEntity postEntity) {
        try {
            // 임시로 기본 사용자 ID 설정 (나중에 로그인 정보로 대체)
            if (postEntity.getUser() == null) {
                // 예시: ID가 1인 사용자를 기본으로 설정
                UserEntity defaultUser = userRepository.findById(1L)
                        .orElseThrow(() -> new RuntimeException("기본 사용자를 찾을 수 없습니다"));
                postEntity.setUser(defaultUser);
            }

            return postRepository.save(postEntity);
        } catch (Exception e) {
            e.printStackTrace(); // 콘솔에 에러 로그 출력
            throw e; // 클라이언트에 에러 전달
        }
    }

    // 전체 게시글 조회는 아래의 getAllPosts() 메서드에서 처리합니다.

    // 게시글 수정
    @PutMapping("/posts/{id}")
    public ResponseEntity<PostFormEntity> updatePost(
            @PathVariable Long id,
            @RequestBody PostFormEntity updatedPost) {
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

    @GetMapping("/posts")
    public List<PostListDto> getAllPosts() {
        return postListService.getAllPostDtos();
    }

}