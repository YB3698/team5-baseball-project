package com.baseball.baseball_pj.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
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
    public List<ScheduleEntity> getAllGames() {
        return scheduleRepository.findAll(); // 엔티티 리스트 바로 리턴
    }
}