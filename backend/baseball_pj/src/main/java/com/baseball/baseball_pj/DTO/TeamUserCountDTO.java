package com.baseball.baseball_pj.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TeamUserCountDTO {
    private String teamName;
    private Long userCount;
}
