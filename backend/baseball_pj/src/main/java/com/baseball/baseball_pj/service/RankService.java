package com.baseball.baseball_pj.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.baseball.baseball_pj.domain.RankEntity;
import com.baseball.baseball_pj.repository.RankRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RankService {

    private final RankRepository rankRepository;

    public List<RankEntity> getTodayRankings() {
        return rankRepository.findByRecordDate(LocalDate.now());
    }
}
