package com.baseball.baseball_pj.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.baseball.baseball_pj.DTO.hittersStatsDto;
import com.baseball.baseball_pj.DTO.pitcherStatsDto;
import com.baseball.baseball_pj.service.HitterStatsService;
import com.baseball.baseball_pj.service.PitcherStatsService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class StatsController {

    private final HitterStatsService hitterStatsService;
    private final PitcherStatsService pitcherStatsService;

    // 타자/투수 기록 조회
    @GetMapping("/stats")
    public ResponseEntity<?> getStats(@RequestParam int year, @RequestParam String type) {
        if ("hitter".equals(type)) {
            List<hittersStatsDto> hitters = hitterStatsService.getHitterStatsDtos(year);
            return ResponseEntity.ok(hitters);
        } else if ("pitcher".equals(type)) {
            List<pitcherStatsDto> pitchers = pitcherStatsService.getPitcherStatsDtos(year);
            return ResponseEntity.ok(pitchers);
        } else {
            return ResponseEntity.badRequest().body(List.of());
        }
    }
}