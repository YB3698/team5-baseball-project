package com.baseball.baseball_pj.Vote.DTO;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

/**
 * 투표(Poll) 정보 응답 DTO
 * - 투표 조회 시 클라이언트로 반환되는 데이터 구조
 */
@Getter @Setter
@Builder
public class PollResponseDTO {
    /**
     * 투표 ID (고유 식별자)
     */
    private Long pollId;

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
    private String isActive;
}
