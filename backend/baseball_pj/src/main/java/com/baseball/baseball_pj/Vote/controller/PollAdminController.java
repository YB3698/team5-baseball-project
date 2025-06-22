package com.baseball.baseball_pj.Vote.controller;

import com.baseball.baseball_pj.Vote.DTO.PollRequestDTO;
import com.baseball.baseball_pj.Vote.DTO.PollResponseDTO;
import com.baseball.baseball_pj.Vote.DTO.VoteOptionRequestDTO;
import com.baseball.baseball_pj.Vote.domain.VoteOptionEntity;
import com.baseball.baseball_pj.Vote.service.PollService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/polls")
public class PollAdminController {

    private final PollService pollService;

    // ✅ 투표 항목 생성
    @PostMapping
    public ResponseEntity<PollResponseDTO> createPoll(@RequestBody PollRequestDTO dto) {
        return ResponseEntity.ok(pollService.createPoll(dto));
    }

    // ✅ 전체 투표 항목 조회
    @GetMapping
    public ResponseEntity<List<PollResponseDTO>> getAllPolls() {
        return ResponseEntity.ok(pollService.getAllPolls());
    }

    @PutMapping("/{pollId}/status")
    public ResponseEntity<?> updatePollStatus(
            @PathVariable Long pollId,
            @RequestParam String isActive) {
        pollService.updatePollStatus(pollId, isActive);
        return ResponseEntity.ok().build();
    }


    // ✅ 선택지 등록
    @PostMapping("/{pollId}/options")
    public ResponseEntity<String> createOption(@PathVariable Long pollId, @RequestBody VoteOptionRequestDTO dto) {
        dto.setPollId(pollId); // pathVariable을 DTO에 세팅
        pollService.createOption(dto);
        return ResponseEntity.ok("선택지 등록 완료");
    }

    // ✅ 선택지 목록 조회
    @GetMapping("/{pollId}/options")
    public ResponseEntity<List<VoteOptionEntity>> getOptions(@PathVariable Long pollId) {
        return ResponseEntity.ok(pollService.getOptionsByPollId(pollId));
    }

    // ✅ 선택지 삭제
    @DeleteMapping("/{pollId}/options/{optionId}")
    public ResponseEntity<?> deleteOption(@PathVariable Long pollId, @PathVariable Long optionId) {
        pollService.deleteOption(pollId, optionId);
        return ResponseEntity.ok().build();
    }

    // ✅ 선택지 수정
    @PutMapping("/{pollId}/options/{optionId}")
    public ResponseEntity<?> updateOption(
            @PathVariable Long pollId,
            @PathVariable Long optionId,
            @RequestBody VoteOptionRequestDTO dto) {
        dto.setPollId(pollId);
        dto.setOptionId(optionId);
        pollService.updateOption(dto);
        return ResponseEntity.ok().build();
    }

    // ✅ 투표 항목 수정
    @PutMapping("/{pollId}")
    public ResponseEntity<?> updatePoll(@PathVariable Long pollId, @RequestBody PollRequestDTO dto) {
        pollService.updatePoll(pollId, dto);
        return ResponseEntity.ok().build();
    }

    // ✅ 투표 항목 삭제
    @DeleteMapping("/{pollId}")
    public ResponseEntity<?> deletePoll(@PathVariable Long pollId) {
        pollService.deletePoll(pollId);
        return ResponseEntity.ok().build();
    }
}


