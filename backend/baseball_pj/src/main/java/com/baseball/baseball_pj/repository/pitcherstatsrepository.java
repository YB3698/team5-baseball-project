package com.baseball.baseball_pj.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.baseball.baseball_pj.domain.pitcherstatsentity;

import java.util.List;

@Repository
public interface pitcherstatsrepository extends JpaRepository<pitcherstatsentity, Long> {

    // 연도별 투수 기록 조회 (ERA 기준 오름차순 정렬)
    List<pitcherstatsentity> findByYearOrderByEraAsc(Integer year);
}
