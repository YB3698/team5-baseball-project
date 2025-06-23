package com.baseball.baseball_pj.Post.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.baseball.baseball_pj.Post.domain.PostFormEntity;

@Repository
public interface PostRepository extends JpaRepository<PostFormEntity, Long> {
}