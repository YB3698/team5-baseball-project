package com.baseball.baseball_pj.controller;

// UserController는 사용자 관련 API를 처리하는 컨트롤러입니다.
import com.baseball.baseball_pj.domain.UserEntity;
import com.baseball.baseball_pj.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

// REST API 컨트롤러임을 명시합니다.
@RestController
// Lombok을 사용하여 생성자 주입을 자동으로 생성합니다.
@RequiredArgsConstructor
// 이 컨트롤러의 기본 URL 경로를 설정합니다.
@RequestMapping("/api/users")
public class UserController {

    // UserRepository를 주입받아 사용자 관련 DB 작업을 처리합니다.
    private final UserRepository userRepository;

    // 회원가입 API
    // 전달받은 UserEntity 객체로 회원가입을 시도합니다.
    @PostMapping("/join")
    public String join(@RequestBody UserEntity user) {
        // 이메일 중복 체크
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return "이미 사용 중인 이메일입니다.";
        }

        // 닉네임 중복 체크
        if (userRepository.findByNickname(user.getNickname()).isPresent()) {
            return "이미 사용 중인 닉네임입니다.";
        }

        // 사용자 정보 저장
        userRepository.save(user);
        return "회원가입 성공";
    }

    // 닉네임 중복 확인 API
    // 닉네임이 사용 가능한지 여부를 반환합니다.
    @GetMapping("/check-nickname")
    public boolean checkNickname(@RequestParam String nickname) {
        return userRepository.findByNickname(nickname).isEmpty();
    }
}
