package com.baseball.baseball_pj.Player.DTO;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

// 관리자  선수정보 수정/생성 요청 DTO
@Getter
@Setter
public class PlayerAdminRequestDTO {
    private Long playerId;
    private String playerName;
    private String playerPosition;
    private Long playerBackNumber;
    private LocalDate playerBirthDate;
    private String playerHeightWeight;
    private String playerEducationPath;
    private Long teamId;
}