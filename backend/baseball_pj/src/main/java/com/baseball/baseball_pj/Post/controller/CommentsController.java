package com.baseball.baseball_pj.Post.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.baseball.baseball_pj.Post.domain.CommentEntity;
import com.baseball.baseball_pj.Post.service.CommentService;

@CrossOrigin(origins = "*", allowCredentials = "false")
@RestController
@RequestMapping("/api")
public class CommentsController {
    @Autowired
    private CommentService commentService;

    @GetMapping("/comments")
    public ResponseEntity<?> getComments(@RequestParam Long postId,
                                         @RequestParam(defaultValue = "0") int page,
                                         @RequestParam(defaultValue = "5") int size) {
        List<CommentEntity> rootComments = commentService.getRootCommentsWithPaging(postId, page, size);

        List<Map<String, Object>> result = rootComments.stream().map(c -> {
            Map<String, Object> commentMap = new HashMap<>();
            commentMap.put("comment", c);
            commentMap.put("replies", commentService.getReplies(c.getCommentId()));
            return commentMap;
        }).toList();

        return ResponseEntity.ok(result);
    }

    @PostMapping("/comments")
    public ResponseEntity<?> createComment(@RequestBody Map<String, Object> payload) {
        Long postId = Long.valueOf(payload.get("postId").toString());
        String content = payload.get("content").toString();
        Long parentId = payload.get("parentId") != null ? Long.valueOf(payload.get("parentId").toString()) : null;
        Long userId = payload.get("userId") != null ? Long.valueOf(payload.get("userId").toString()) : null;
        if (userId == null) {
            return ResponseEntity.status(401).body("로그인 후에 댓글 작성이 가능합니다.");
        }
        CommentEntity comment = commentService.createComment(postId, content, parentId, userId);
        return ResponseEntity.ok(comment);
    }

    @PutMapping("/comments/{commentId}")
    public ResponseEntity<?> updateComment(@PathVariable Long commentId, @RequestBody Map<String, Object> payload) {
        Long userId = payload.get("userId") != null ? Long.valueOf(payload.get("userId").toString()) : null;
        String content = payload.get("content").toString();
        if (userId == null) return ResponseEntity.status(401).body("로그인 필요");
        boolean ok = commentService.updateComment(commentId, userId, content);
        if (!ok) return ResponseEntity.status(403).body("본인만 수정할 수 있습니다.");
        return ResponseEntity.ok("수정 완료");
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable Long commentId, @RequestBody Map<String, Object> payload) {
        Long userId = payload.get("userId") != null ? Long.valueOf(payload.get("userId").toString()) : null;
        if (userId == null) return ResponseEntity.status(401).body("로그인 필요");
        boolean ok = commentService.deleteComment(commentId, userId);
        if (!ok) return ResponseEntity.status(403).body("본인만 삭제할 수 있습니다.");
        return ResponseEntity.ok("삭제 완료");
    }
}
