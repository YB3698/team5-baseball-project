package com.baseball.baseball_pj.DTO;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

// 관리자 회원정보 응답 DTO
@Getter
@Setter
@Builder
public class UserAdminResponseDTO {
    private Long id;
    private String email;
    private String nickname;
    private Long teamId;
    private String role;
    private LocalDate createdAt;
}
