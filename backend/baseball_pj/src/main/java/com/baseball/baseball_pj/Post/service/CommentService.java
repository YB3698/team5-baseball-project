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
        return createComment(postId, content, parentId, null);
    }

    public CommentEntity createComment(Long postId, String content, Long parentId, Long userId) {
        CommentEntity comment = new CommentEntity();
        comment.setContent(content);
        comment.setCreatedAt(java.time.LocalDateTime.now());
        comment.setPost(new com.baseball.baseball_pj.Post.domain.PostEntity());
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

    public boolean updateComment(Long commentId, Long userId, String content) {
        CommentEntity comment = commentRepository.findById(commentId).orElse(null);
        if (comment == null || comment.getUser() == null || !comment.getUser().getId().equals(userId)) {
            return false;
        }
        comment.setContent(content);
        commentRepository.save(comment);
        return true;
    }

    public boolean deleteComment(Long commentId, Long userId) {
        CommentEntity comment = commentRepository.findById(commentId).orElse(null);
        if (comment == null || comment.getUser() == null) {
            return false;
        }
        // userId가 110번이면 무조건 관리자 권한 부여
        boolean isAdmin = (userId != null && userId == 110L);
        // 본인 또는 관리자만 삭제 가능
        if (!isAdmin && !comment.getUser().getId().equals(userId)) {
            return false;
        }
        // 대댓글이 있는지 확인
        boolean hasReplies = !commentRepository.findByParent_CommentId(commentId).isEmpty();
        if (hasReplies) {
            if (isAdmin) {
                comment.setContent("※관리자에 의해 삭제된 댓글입니다. ※");
            } else {
                comment.setContent("삭제된 댓글입니다.");
            }
            commentRepository.save(comment);
        } else {
            commentRepository.deleteById(commentId);
        }
        return true;
    }

    public List<CommentEntity> getAllRootComments(Long postId) {
        return commentRepository.findByPost_PostIdAndParentIsNullOrderByCreatedAt(postId);
    }
}
