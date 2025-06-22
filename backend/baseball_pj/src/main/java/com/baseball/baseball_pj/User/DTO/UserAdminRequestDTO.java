package com.baseball.baseball_pj.User.DTO;

import lombok.Getter;
import lombok.Setter;

// 관리자 회원정보 수정/생성 요청 DTO
@Getter
@Setter
public class UserAdminRequestDTO {
    private Long id;
    private String email;
    private String nickname;
    private Long favoriteTeamId;
    private String role;
}
