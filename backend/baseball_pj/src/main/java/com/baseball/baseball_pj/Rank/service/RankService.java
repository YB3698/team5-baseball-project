package com.baseball.baseball_pj.Rank.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.baseball.baseball_pj.Rank.domain.RankEntity;
import com.baseball.baseball_pj.Rank.repository.RankRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RankService {

    private final RankRepository rankRepository;

    public List<RankEntity> getTodayRankings() {
        return rankRepository.findByRecordDate(LocalDate.now());
    }
}
