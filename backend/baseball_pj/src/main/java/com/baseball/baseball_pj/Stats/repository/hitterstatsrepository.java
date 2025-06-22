package com.baseball.baseball_pj.Stats.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.baseball.baseball_pj.Stats.domain.hitterstatsentity;

import java.util.List;

@Repository
public interface hitterstatsrepository extends JpaRepository<hitterstatsentity, Long> {

    // 연도별 타자 기록 조회 (AVG 기준 내림차순 정렬)
    List<hitterstatsentity> findByYearOrderByAvgDesc(Integer year);
}
