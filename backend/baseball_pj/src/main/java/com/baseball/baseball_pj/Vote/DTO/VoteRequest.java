package com.baseball.baseball_pj.Vote.DTO;
// dto는 데이터 전송 객체(Data Transfer Object)의 약자로, 주로 API 요청/응답 시 데이터를 전달하기 위해 사용됩니다.
// 택배 박스라고 생각하면 됨. 프론트에 전달할 때 필요한 정보만 담아서 전달
// VoteRequest는 투표 요청 시 필요한 데이터를 담는 DTO 클래스입니다.(프론트와 백엔드 간 데이터 전송을 위한 객체)

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VoteRequest {
    private Long playerId; // playerId(Long) 필드 추가
    private Long pollId; // pollId(Long) 필드 추가
    private Long userId; // userId 필드 추가
}
