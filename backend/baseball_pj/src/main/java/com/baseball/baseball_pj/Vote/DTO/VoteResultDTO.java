package com.baseball.baseball_pj.Vote.DTO;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@Builder
public class VoteResultDTO {
    private Long optionId;      // 선택지 ID
    private String description; // 선택지 내용
    private Long voteCount;     // 투표 수
}
