package com.baseball.baseball_pj.Player.DTO;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

// 관리자 회원정보 응답 DTO
@Getter
@Setter
@Builder
public class PlayerAdminResponseDTO {
    private Long playerId;
    private String playerName;
    private String playerPosition;
    private Long playerBackNumber;
    private LocalDate playerBirthDate;
    private String playerHeightWeight;
    private String playerEducationPath;
    private Long teamId;
}
