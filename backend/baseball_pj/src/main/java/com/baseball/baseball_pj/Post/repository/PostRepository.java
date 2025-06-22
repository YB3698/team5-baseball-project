package com.baseball.baseball_pj.Post.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.baseball.baseball_pj.Post.domain.PostEntity;

@Repository
public interface PostRepository extends JpaRepository<PostEntity, Long> {
}
