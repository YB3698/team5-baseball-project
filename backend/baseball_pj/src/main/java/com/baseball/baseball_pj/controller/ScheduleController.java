package com.baseball.baseball_pj.controller;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.baseball.baseball_pj.domain.ScheduleEntity;
import com.baseball.baseball_pj.repository.ScheduleRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ScheduleController {

    private final ScheduleRepository scheduleRepository;

    @GetMapping("/schedule")
public List<ScheduleEntity> getScheduleByYearMonth(
    @RequestParam int year,
    @RequestParam int month) {
    
    // 예: LocalDateTime 기준으로 필터링
    LocalDate start = LocalDate.of(year, month, 1);
    LocalDate end = start.withDayOfMonth(start.lengthOfMonth());

    return scheduleRepository.findByGameDateBetween(
        start.atStartOfDay(),
        end.atTime(LocalTime.MAX)
    );
}
}