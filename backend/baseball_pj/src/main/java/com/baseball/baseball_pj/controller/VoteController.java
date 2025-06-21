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
@RestController  // REST API 컨트롤러(웹에서 요청오면 반응, json 형식으로 응답 보냄)
@RequestMapping("/api") // 공통 경로 설정
@RequiredArgsConstructor // final로 선언된 필드(voteservice)에 대해 자동으로 생성자를 만들어주는 Lombok 어노테이션
public class VoteController {

    // 투표 관련 비즈니스 로직을 처리하는 서비스(중복투표확인, 투표 저장 등)
    private final VoteService voteService;

    /**
     * 투표 요청을 처리하는 엔드포인트
     * 
     * @param userDetails 인증된 사용자 정보(Spring Security, 필요시 사용)
     * @param voteRequest 프론트에서 전달받은 투표 정보(userId, playerId, poll)
     * @return 투표 성공/실패 응답
     */
    @PostMapping("/votes") // POST 요청을 처리하는 엔드포인트, 프론트에서 /api/votes 경로로 요청이 오면 이 메소드가 실행됨
    public ResponseEntity<?> vote( // @AuthenticationPrincipal 어노테이션을 사용하여 현재 인증된 사용자 정보를 가져옴
            @AuthenticationPrincipal UserDetails userDetails, 
        // AtuhenticationPrincipal는 현재 로그인한 사용자 정보를 자동으로 주입해주는 스프링 시큐리티의 어노테이션, userDetails는 현재 로그인한 사용자의 정보를 담는 객체 타입
            @RequestBody VoteRequest voteRequest) { // @RequestBody 어노테이션을 사용하여 프론트에서 전달받은 JSON 데이터를 VoteRequest 객체로 변환
        Long userId = voteRequest.getUserId(); // 투표한 회원의 PK
        Long playerId = voteRequest.getPlayerId(); // 투표 대상 선수의 PK
        String poll = voteRequest.getPoll(); // 투표 기간

        // 중복 투표 체크: 이미 투표한 경우 409(CONFLICT) 반환
        if (voteService.hasUserVoted(userId, playerId, poll)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("이미 투표하셨습니다.");
        }

        // 투표 저장
        voteService.saveVote(userId, playerId, poll);
        return ResponseEntity.ok("투표 완료!");
    }
}
