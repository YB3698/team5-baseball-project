package com.baseball.baseball_pj.Team.domain;

// UserEntity는 USERS 테이블과 매핑되는 사용자 엔티티 클래스입니다.
import jakarta.persistence.*;
import lombok.*;

// JPA 엔티티임을 명시합니다.
@Entity
// USERS 테이블과 매핑합니다.
@Table(name = "TEAMS")
// Lombok을 사용하여 Getter, Setter, 생성자, 빌더 등을 자동 생성합니다.
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeamEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    @Column(name = "team_id")
    private Long teamId;

    @Column(name = "team_name")
    private String teamName;

    @Column(name = "team_mascot")
    private String teamMascot;

    @Column(name = "team_stadium")
    private String teamStadium;

    @Column(name = "team_created_at")
    private Long teamCreatedAt; // number 타입

    @Column(name = "team_logo")
    private String teamLogo; // String 타입

    // ✅ Getter/Setter (Lombok 써도 됨)
    // @Getter @Setter 혹은 직접 작성
}
