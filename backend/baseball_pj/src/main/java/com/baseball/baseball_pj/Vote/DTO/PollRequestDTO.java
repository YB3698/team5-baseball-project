package com.baseball.baseball_pj.Vote.DTO;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

/**
 * 투표(Poll) 생성 및 수정 요청을 위한 DTO
 * - 프론트엔드에서 투표 생성/수정 시 사용
 */
@Getter @Setter
public class PollRequestDTO {
    /**
     * 투표 제목
     */
    private String pollTitle;

    /**
     * 투표 시작일 (yyyy-MM-dd)
     */
    private LocalDate startDate;

    /**
     * 투표 종료일 (yyyy-MM-dd)
     */
    private LocalDate endDate;

    /**
     * 투표 활성화 여부 ('Y': 활성, 'N': 비활성)
     */
    private String isActive; // 'Y' or 'N'
}
