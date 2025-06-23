package com.baseball.baseball_pj.Post.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.baseball.baseball_pj.Post.domain.CommentEntity;

public interface CommentRepository extends JpaRepository<CommentEntity, Long> {

    // 특정 게시글의 최상위 댓글만 (parent가 null)
    @Query(value = "SELECT * FROM (SELECT a.*, ROWNUM rnum FROM (SELECT * FROM COMMENTS WHERE POST_ID = :postId AND PARENT_ID IS NULL ORDER BY COMMENT_CREATED_AT) a WHERE ROWNUM <= :endRow) WHERE rnum > :startRow", nativeQuery = true)
    List<CommentEntity> findRootCommentsWithPaging(@Param("postId") Long postId, @Param("startRow") int startRow, @Param("endRow") int endRow);

    // 대댓글 조회
    List<CommentEntity> findByParent_CommentId(Long parentId);

    // 게시글의 전체 댓글 수
    Long countByPost_PostId(Long postId);

    // 게시글의 모든 최상위 댓글 반환 (parent가 null)
    List<CommentEntity> findByPost_PostIdAndParentIsNullOrderByCreatedAt(Long postId);
}
