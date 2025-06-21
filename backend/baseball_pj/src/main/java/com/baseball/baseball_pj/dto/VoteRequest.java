package com.baseball.baseball_pj.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VoteRequest {
    private Long playerId;
    private String poll;
    private Long userId; // userId 필드 추가
}
