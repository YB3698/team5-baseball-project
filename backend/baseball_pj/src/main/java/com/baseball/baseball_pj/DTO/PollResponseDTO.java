package com.baseball.baseball_pj.DTO;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter @Setter
@Builder
public class PollResponseDTO {
    private Long pollId;
    private String pollTitle;
    private LocalDate startDate;
    private LocalDate endDate;
    private String isActive;
}
