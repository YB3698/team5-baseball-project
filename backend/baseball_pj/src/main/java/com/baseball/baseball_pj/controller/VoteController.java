package com.baseball.baseball_pj.controller;

import com.baseball.baseball_pj.service.VoteService;
import com.baseball.baseball_pj.dto.VoteRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

// 투표 관련 API를 제공하는 컨트롤러
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class VoteController {

    // 투표 관련 비즈니스 로직을 처리하는 서비스
    private final VoteService voteService;

    /**
     * 투표 요청을 처리하는 엔드포인트
     * 
     * @param userDetails 인증된 사용자 정보(Spring Security, 필요시 사용)
     * @param voteRequest 프론트에서 전달받은 투표 정보(userId, playerId, poll)
     * @return 투표 성공/실패 응답
     */
    @PostMapping("/votes")
    public ResponseEntity<?> vote(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody VoteRequest voteRequest) {
        // userId는 프론트에서 전달받은 값을 사용 (VoteRequest에 포함)
        Long userId = voteRequest.getUserId(); // 투표한 회원의 PK
        Long playerId = voteRequest.getPlayerId(); // 투표 대상 선수의 PK
        String poll = voteRequest.getPoll(); // 투표 기간/이름

        // 중복 투표 체크: 이미 투표한 경우 409(CONFLICT) 반환
        if (voteService.hasUserVoted(userId, playerId, poll)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("이미 투표하셨습니다.");
        }

        // 투표 저장
        voteService.saveVote(userId, playerId, poll);
        return ResponseEntity.ok("투표 완료!");
    }
}
