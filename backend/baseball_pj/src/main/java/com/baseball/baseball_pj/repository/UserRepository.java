package com.baseball.baseball_pj.repository;

// UserRepository는 UserEntity에 대한 데이터베이스 접근을 담당하는 JPA 리포지토리 인터페이스입니다.
import com.baseball.baseball_pj.domain.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

// JpaRepository를 상속받아 기본적인 CRUD 메서드를 제공합니다.
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    // 이메일로 사용자 정보를 조회합니다.
    Optional<UserEntity> findByEmail(String email);
    // 닉네임으로 사용자 정보를 조회합니다.
    Optional<UserEntity> findByNickname(String nickname);
}
