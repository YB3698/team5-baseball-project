package com.baseball.baseball_pj.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.baseball.baseball_pj.domain.RankEntity;
import com.baseball.baseball_pj.service.RankService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/ranks")
@RequiredArgsConstructor
public class RankController {

    private final RankService rankService;

    @GetMapping("/today")
    public List<RankEntity> getTodayRankings() {
        return rankService.getTodayRankings();
    }
}
