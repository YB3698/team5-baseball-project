package com.baseball.baseball_pj.User.domain;

// UserEntity는 USERS 테이블과 매핑되는 사용자 엔티티 클래스입니다.
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

// JPA 엔티티임을 명시합니다.
@Entity
// USERS 테이블과 매핑합니다.
@Table(name = "USERS")
// Lombok을 사용하여 Getter, Setter, 생성자, 빌더 등을 자동 생성합니다.
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UserEntity {

    // 사용자 고유 ID (PK)
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_seq_gen")
    @SequenceGenerator(name = "user_seq_gen", sequenceName = "SEQ_USERS", allocationSize = 1)
    @Column(name = "USER_ID")
    private Long id;

    // 사용자 이메일 (중복 불가, 필수)
    @Column(name = "USER_EMAIL", nullable = false, unique = true)
    private String email;

    // 사용자 비밀번호 (필수)
    @Column(name = "USER_PASSWORD", nullable = false)
    private String password;

    // 사용자 닉네임 (필수)
    @Column(name = "USER_NICKNAME", nullable = false)
    private String nickname;

    // 선호 팀 ID (필수)
    @Column(name = "TEAM_ID", nullable = false)
    private Long favoriteTeamId;

    // 사용자 권한 (기본값: user)
    @Builder.Default
    @Column(name = "USER_ROLE", nullable = false)
    private String role = "user";

    // 계정 생성일시 (기본값: 현재 시간)
    @Builder.Default
    @Column(name = "USER_CREATED_AT")
    private LocalDateTime createdAt = LocalDateTime.now();
}
