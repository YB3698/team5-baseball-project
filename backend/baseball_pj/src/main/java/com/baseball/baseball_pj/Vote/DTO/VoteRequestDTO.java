package com.baseball.baseball_pj.Vote.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class VoteRequestDTO {
    private Long userId;      // 어떤 유저가
    private Long pollId;      // 어떤 항목에
    private Long optionId;    // 어떤 선택지에 투표했는지
}
