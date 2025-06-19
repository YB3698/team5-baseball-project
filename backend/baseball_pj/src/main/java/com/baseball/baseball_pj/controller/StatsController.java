package com.baseball.baseball_pj.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.baseball.baseball_pj.domain.hitterstatsentity;
import com.baseball.baseball_pj.domain.pitcherstatsentity;
import com.baseball.baseball_pj.repository.hitterstatsrepository;
import com.baseball.baseball_pj.repository.pitcherstatsrepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class StatsController {

    private final hitterstatsrepository hitterStatsRepository;
    private final pitcherstatsrepository pitcherStatsRepository;

    // 타자 기록 조회
    @GetMapping("/stats")
    public ResponseEntity<?> getStats(@RequestParam int year, @RequestParam String type) {
        if ("hitter".equals(type)) {
            System.out.println(type);
            List<hitterstatsentity> hitters = getHitterStats(year);
            return ResponseEntity.ok(hitters);
        } else if ("pitcher".equals(type)) {
            System.out.println(type);
            List<pitcherstatsentity> pitchers = getPitcherStats(year);
            return ResponseEntity.ok(pitchers);
        } else {
            return ResponseEntity.badRequest().body(List.of());
        }
    }

    // 타자 기록 조회
    private List<hitterstatsentity> getHitterStats(int year) {
        return hitterStatsRepository.findByYearOrderByAvgDesc(year); // 타자 기록을 연도별로 내림차순 정렬해서 반환
    }

    // 투수 기록 조회
    private List<pitcherstatsentity> getPitcherStats(int year) {
        return pitcherStatsRepository.findByYearOrderByEraAsc(year); // 투수 기록을 연도별로 ERA 기준으로 오름차순 정렬해서 반환
    }
}
