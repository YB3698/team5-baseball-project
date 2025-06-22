package com.baseball.baseball_pj.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class VoteOptionRequestDTO {
    private Long pollId;       // 어떤 항목에 소속될지
    private Long optionId;     // 선택지 ID (선택적, 없으면 새로 생성)
    private String description; // 선택지 내용 (예: "양의지")
}
