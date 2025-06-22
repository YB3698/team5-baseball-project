package com.baseball.baseball_pj.DTO;

import lombok.Getter;
import lombok.Setter;

// 관리자 회원정보 수정/생성 요청 DTO
@Getter
@Setter
public class UserAdminRequestDTO {
    private Long id;
    private String nickname;
    private String email;
    private String password;
    private String role;
    private Long favoriteTeamId;
    // 필요시 상태 등 추가
}
