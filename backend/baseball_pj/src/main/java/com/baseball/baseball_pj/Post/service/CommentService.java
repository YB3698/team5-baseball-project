package com.baseball.baseball_pj.Post.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.baseball.baseball_pj.Post.domain.CommentEntity;
import com.baseball.baseball_pj.Post.repository.CommentRepository;

@Service
public class CommentService {
    @Autowired
    private CommentRepository commentRepository;

    public List<CommentEntity> getReplies(Long parentId) {
        return commentRepository.findByParent_CommentId(parentId);
    }

    public CommentEntity createComment(Long postId, String content, Long parentId) {
        CommentEntity comment = new CommentEntity();
        comment.setContent(content);
        comment.setCreatedAt(java.time.LocalDateTime.now());
        // post, parent 엔티티 세팅
        comment.setPost(new com.baseball.baseball_pj.Post.domain.PostFormEntity());
        comment.getPost().setPostId(postId);
        if (parentId != null) {
            CommentEntity parent = new CommentEntity();
            parent.setCommentId(parentId);
            comment.setParent(parent);
        }
        // user 정보는 추후 인증 연동 시 추가
        return commentRepository.save(comment);
    }

    public CommentEntity createComment(Long postId, String content, Long parentId, Long userId) {
        CommentEntity comment = new CommentEntity();
        comment.setContent(content);
        comment.setCreatedAt(java.time.LocalDateTime.now());
        // post, parent 엔티티 세팅
        comment.setPost(new com.baseball.baseball_pj.Post.domain.PostFormEntity());
        comment.getPost().setPostId(postId);
        if (parentId != null) {
            CommentEntity parent = new CommentEntity();
            parent.setCommentId(parentId);
            comment.setParent(parent);
        }
        if (userId != null) {
            com.baseball.baseball_pj.User.domain.UserEntity user = new com.baseball.baseball_pj.User.domain.UserEntity();
            user.setId(userId);
            comment.setUser(user);
        }
        return commentRepository.save(comment);
    }

    public List<CommentEntity> getRootCommentsWithPaging(Long postId, int page, int size) {
        int startRow = page * size;
        int endRow = startRow + size;
        return commentRepository.findRootCommentsWithPaging(postId, startRow, endRow);
    }
}
