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

/**
 * 관리자용 투표(Poll) 관리 컨트롤러
 * - 투표 생성, 조회, 수정, 삭제
 * - 투표 선택지(옵션) 생성, 조회, 수정, 삭제
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/polls")
public class PollAdminController {

    // PollService 의존성 주입 (비즈니스 로직 처리)
    private final PollService pollService;

    /**
     * 투표 항목 생성
     * @param dto 투표 생성 요청 DTO
     * @return 생성된 투표 정보
     */
    @PostMapping
    public ResponseEntity<PollResponseDTO> createPoll(@RequestBody PollRequestDTO dto) {
        return ResponseEntity.ok(pollService.createPoll(dto));
    }

    /**
     * 전체 투표 항목 목록 조회
     * @return 모든 투표 항목 리스트
     */
    @GetMapping
    public ResponseEntity<List<PollResponseDTO>> getAllPolls() {
        return ResponseEntity.ok(pollService.getAllPolls());
    }

    /**
     * 투표 활성/비활성 상태 변경
     * @param pollId 투표 ID
     * @param isActive 활성화 여부 (ex: true/false)
     */
    @PutMapping("/{pollId}/status")
    public ResponseEntity<?> updatePollStatus(
            @PathVariable Long pollId,
            @RequestParam String isActive) {
        pollService.updatePollStatus(pollId, isActive);
        return ResponseEntity.ok().build();
    }

    /**
     * 투표 선택지(옵션) 등록
     * @param pollId 투표 ID
     * @param dto 선택지 생성 요청 DTO
     * @return 등록 완료 메시지
     */
    @PostMapping("/{pollId}/options")
    public ResponseEntity<String> createOption(@PathVariable Long pollId, @RequestBody VoteOptionRequestDTO dto) {
        dto.setPollId(pollId); // pathVariable을 DTO에 세팅
        pollService.createOption(dto);
        return ResponseEntity.ok("선택지 등록 완료");
    }

    /**
     * 특정 투표의 선택지(옵션) 목록 조회
     * @param pollId 투표 ID
     * @return 선택지 리스트
     */
    @GetMapping("/{pollId}/options")
    public ResponseEntity<List<VoteOptionEntity>> getOptions(@PathVariable Long pollId) {
        return ResponseEntity.ok(pollService.getOptionsByPollId(pollId));
    }

    /**
     * 특정 투표의 선택지(옵션) 삭제
     * @param pollId 투표 ID
     * @param optionId 선택지 ID
     */
    @DeleteMapping("/{pollId}/options/{optionId}")
    public ResponseEntity<?> deleteOption(@PathVariable Long pollId, @PathVariable Long optionId) {
        pollService.deleteOption(pollId, optionId);
        return ResponseEntity.ok().build();
    }

    /**
     * 특정 투표의 선택지(옵션) 수정
     * @param pollId 투표 ID
     * @param optionId 선택지 ID
     * @param dto 선택지 수정 요청 DTO
     */
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

    /**
     * 투표 항목 수정
     * @param pollId 투표 ID
     * @param dto 투표 수정 요청 DTO
     */
    @PutMapping("/{pollId}")
    public ResponseEntity<?> updatePoll(@PathVariable Long pollId, @RequestBody PollRequestDTO dto) {
        pollService.updatePoll(pollId, dto);
        return ResponseEntity.ok().build();
    }

    /**
     * 투표 항목 삭제
     * @param pollId 투표 ID
     */
    @DeleteMapping("/{pollId}")
    public ResponseEntity<?> deletePoll(@PathVariable Long pollId) {
        pollService.deletePoll(pollId);
        return ResponseEntity.ok().build();
    }
}


