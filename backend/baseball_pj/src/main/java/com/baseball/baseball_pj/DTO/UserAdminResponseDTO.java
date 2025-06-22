package com.baseball.baseball_pj.DTO;

import lombok.Getter;
import lombok.Setter;

// 관리자 회원정보 응답 DTO
@Getter
@Setter
public class UserAdminResponseDTO {
    private Long id;
    private String nickname;
    private String email;
    private String role;
    private String createdAt;
    private Long favoriteTeamId;
    // 필요시 상태, 마지막 로그인 등 추가
}
