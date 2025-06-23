package com.baseball.baseball_pj.Player.domain;

import java.time.LocalDate;

// UserEntity는 USERS 테이블과 매핑되는 사용자 엔티티 클래스입니다.
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// JPA 엔티티임을 명시합니다.
@Entity
// USERS 테이블과 매핑합니다.
@Table(name = "PLAYERS")
// Lombok을 사용하여 Getter, Setter, 생성자, 빌더 등을 자동 생성합니다.
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlayerEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    @Column(name = "player_id")
    private Long playerId;

    @Column(name = "player_name")
    private String playerName;

    @Column(name = "player_position")
    private String playerPosition;

    @Column(name = "player_back_number")
    private Integer playerBackNumber;

    @Column(name = "player_birth_date")
    private LocalDate playerBirthDate;

    @Column(name = "player_height_weight")
    private String playerHeightWeight;

    @Column(name = "player_education_path")
    private String playerEducationPath;

    @Column(name = "team_id")
    private Long teamId;

    // ✅ Getter/Setter (Lombok 써도 됨)
    // @Getter @Setter 혹은 직접 작성
}
