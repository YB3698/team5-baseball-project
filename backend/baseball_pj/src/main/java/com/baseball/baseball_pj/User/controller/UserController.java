package com.baseball.baseball_pj.User.controller;

// 사용자 관련 REST API를 제공하는 컨트롤러 클래스입니다.
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import java.util.concurrent.ConcurrentHashMap;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;

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
    private final UserService userService;

    // ✅ [추가] 응원 팀 변경 여부 저장용
    private final Map<Long, Boolean> teamChangeMap = new ConcurrentHashMap<>();

    @PostMapping("/join")
    public ResponseEntity<String> join(@RequestBody UserEntity user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("이미 사용 중인 이메일입니다.");
        }
        if (userRepository.findByNickname(user.getNickname()).isPresent()) {
            return ResponseEntity.badRequest().body("이미 사용 중인 닉네임입니다.");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("user");
        userRepository.save(user);
        return ResponseEntity.ok("회원가입 성공");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserEntity loginRequest) {
        Optional<UserEntity> optionalUser = userRepository.findByEmail(loginRequest.getEmail());
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("존재하지 않는 이메일입니다.");
        }

        UserEntity user = optionalUser.get();
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("비밀번호가 일치하지 않습니다.");
        }

        Map<String, Object> result = new HashMap<>();
        result.put("userId", user.getId());
        result.put("email", user.getEmail());
        result.put("nickname", user.getNickname());
        result.put("role", user.getRole());
        result.put("teamId", user.getFavoriteTeamId());

        // ✅ [추가] 팀 변경 여부 반환
        result.put("hasChangedTeam", teamChangeMap.getOrDefault(user.getId(), false));

        return ResponseEntity.ok(result);
    }

    @GetMapping("/check-email")
    public boolean checkEmail(@RequestParam String email) {
        return userRepository.findByEmail(email).isEmpty();
    }

    @GetMapping("/check-nickname")
    public boolean checkNickname(@RequestParam String nickname) {
        return userRepository.findByNickname(nickname).isEmpty();
    }

    @GetMapping("/team-distribution")
    public ResponseEntity<List<Map<String, Object>>> getTeamDistribution() {
        return ResponseEntity.ok(userService.getUserCountByTeam());
    }

    // ✅ [전체 추가] 사용자 정보 수정 + 응원 팀 1회 변경 제한
    @PutMapping("/{userId}/update-info")
    public ResponseEntity<?> updateUserInfo(@PathVariable Long userId, @RequestBody Map<String, Object> request) {
        Optional<UserEntity> optionalUser = userRepository.findById(userId);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("사용자를 찾을 수 없습니다.");
        }

        UserEntity user = optionalUser.get();

        String newNickname = request.get("nickname").toString();
        String newEmail = request.get("email").toString();
        Long newTeamId = Long.valueOf(request.get("teamId").toString());

        if (!user.getFavoriteTeamId().equals(newTeamId)) {
            if (teamChangeMap.getOrDefault(userId, false)) {
                return ResponseEntity.badRequest().body("응원 팀은 한 번만 변경할 수 있습니다.");
            }
            user.setFavoriteTeamId(newTeamId);
            teamChangeMap.put(userId, true);
        }

        user.setNickname(newNickname);
        user.setEmail(newEmail);
        userRepository.save(user);

        return ResponseEntity.ok("정보 수정 완료");
    }
}