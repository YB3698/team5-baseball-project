package com.baseball.baseball_pj.User.controller;

// 사용자 관련 REST API를 제공하는 컨트롤러 클래스입니다.
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.baseball.baseball_pj.User.domain.UserEntity;
import com.baseball.baseball_pj.User.repository.UserRepository;
import com.baseball.baseball_pj.User.service.UserService;

import lombok.RequiredArgsConstructor;

// REST API 컨트롤러임을 명시합니다.
@RestController
// /api/users 경로로 들어오는 요청을 처리합니다.
@RequestMapping("/api/users")
// 생성자 주입을 자동으로 생성합니다.
@RequiredArgsConstructor
public class UserController {

    // 사용자 DB 접근을 위한 리포지토리
    private final UserRepository userRepository;
    // 비밀번호 암호화를 위한 BCryptPasswordEncoder
    private final BCryptPasswordEncoder passwordEncoder;

    // ✅ 회원가입 API
    // 전달받은 UserEntity 객체로 회원가입을 시도합니다.
    @PostMapping("/join")
    public ResponseEntity<String> join(@RequestBody UserEntity user) {
        // 이메일 중복 체크
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("이미 사용 중인 이메일입니다.");
        }

        // 닉네임 중복 체크
        if (userRepository.findByNickname(user.getNickname()).isPresent()) {
            return ResponseEntity.badRequest().body("이미 사용 중인 닉네임입니다.");
        }

        // 비밀번호 암호화 후 저장
        String encryptedPw = passwordEncoder.encode(user.getPassword());
        user.setPassword(encryptedPw);

        // 기본 역할(role) 설정
        user.setRole("user");

        // 사용자 정보 저장
        userRepository.save(user);
        return ResponseEntity.ok("회원가입 성공");
    }

    // ✅ 로그인 API
    // 이메일과 비밀번호를 받아 로그인 처리
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserEntity loginRequest) {
        // 이메일로 사용자 조회
        Optional<UserEntity> optionalUser = userRepository.findByEmail(loginRequest.getEmail());

        // 사용자가 존재하지 않을 경우
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("존재하지 않는 이메일입니다.");
        }

        UserEntity user = optionalUser.get();

        // 🔐 비밀번호 일치 여부 확인 (BCrypt 사용)
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("비밀번호가 일치하지 않습니다.");
        }

        // 로그인 성공 시 사용자 정보 반환
        Map<String, Object> result = new HashMap<>();
        result.put("userId", user.getId());
        result.put("email", user.getEmail());
        result.put("nickname", user.getNickname());
        result.put("role", user.getRole());
        result.put("teamId", user.getFavoriteTeamId());

        return ResponseEntity.ok(result);
    }

    // ✅ 이메일 중복 확인 API
    // 이메일이 사용 가능한지 여부를 반환합니다.
    @GetMapping("/check-email")
    public boolean checkEmail(@RequestParam String email) {
        return userRepository.findByEmail(email).isEmpty();
    }

    // ✅ 닉네임 중복 확인 API
    // 닉네임이 사용 가능한지 여부를 반환합니다.
    @GetMapping("/check-nickname")
    public boolean checkNickname(@RequestParam String nickname) {
        return userRepository.findByNickname(nickname).isEmpty();
    }

    private final UserService userService;

    @GetMapping("/team-distribution")
    public ResponseEntity<List<Map<String, Object>>> getTeamDistribution() {
        return ResponseEntity.ok(userService.getUserCountByTeam());
    }
}
