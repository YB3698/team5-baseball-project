package com.baseball.baseball_pj.Vote.DTO;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter @Setter
public class PollRequestDTO {
    private String pollTitle;
    private LocalDate startDate;
    private LocalDate endDate;
    private String isActive; // 'Y' or 'N'
}
