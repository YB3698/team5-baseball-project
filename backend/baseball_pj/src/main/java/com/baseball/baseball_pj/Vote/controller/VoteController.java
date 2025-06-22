package com.baseball.baseball_pj.Vote.controller;

import com.baseball.baseball_pj.Vote.DTO.VoteRequestDTO;
import com.baseball.baseball_pj.Vote.DTO.VoteResultDTO;
import com.baseball.baseball_pj.Vote.service.VoteService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 사용자 투표 관련 컨트롤러
 * - 투표 등록
 * - 투표 결과 조회
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/votes")
public class VoteController {

    // VoteService 의존성 주입 (투표 관련 비즈니스 로직 처리)
    private final VoteService voteService;

    /**
     * 사용자 투표 등록
     * @param dto 투표 요청 DTO (사용자가 선택한 투표 정보)
     * @return 투표 완료 메시지
     */
    @PostMapping
    public ResponseEntity<String> vote(@RequestBody VoteRequestDTO dto) {
        voteService.vote(dto);
        return ResponseEntity.ok("투표 완료!");
    }

    /**
     * 특정 투표 항목의 결과 조회
     * @param pollId 투표 ID
     * @return 각 선택지별 투표 결과 리스트
     */
    @GetMapping("/{pollId}/results")
    public ResponseEntity<List<VoteResultDTO>> getResults(@PathVariable Long pollId) {
        return ResponseEntity.ok(voteService.getVoteResults(pollId));
    }
}
