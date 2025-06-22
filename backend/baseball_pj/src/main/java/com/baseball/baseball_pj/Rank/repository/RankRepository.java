package com.baseball.baseball_pj.Rank.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.baseball.baseball_pj.Rank.domain.RankEntity;

@Repository
public interface RankRepository extends JpaRepository<RankEntity, Long> {
    List<RankEntity> findByRecordDate(LocalDate recordDate);
}

