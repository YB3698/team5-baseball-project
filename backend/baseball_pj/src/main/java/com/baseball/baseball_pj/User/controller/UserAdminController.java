package com.baseball.baseball_pj.User.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.baseball.baseball_pj.User.DTO.UserAdminResponseDTO;
import com.baseball.baseball_pj.User.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController // API 요청을 처리하는 컨트롤러임을 의미(json 형태로 응답)
@RequestMapping("/api/admin/users") // 이 클래스 안의 모든 API는 /api/admin/users 경로로 시작
@RequiredArgsConstructor // final로 선언된 변수는 자동으로 생성자 주입
public class UserAdminController {
    private final UserService userService; // UserService를 주입받아 사용

    // 전체 회원 목록 조회
    @GetMapping
    public List<UserAdminResponseDTO> getAllUsers() { // entity → DTO 변환하여 반환
        return userService.getAllUsers(); // json 형태로 반환
    }

    // 단일 회원 조회
    @GetMapping("/{userId}")
    public UserAdminResponseDTO getUser(@PathVariable Long userId) { // @PathVariable로 URL 경로에서 userId를 추출
        return userService.getUser(userId); // userId에 해당하는 회원 정보를 조회하여 반환
    }

    // 회원 정보 수정
    @PutMapping("/{userId}")
    public UserAdminResponseDTO updateUser(@PathVariable Long userId, @RequestBody UserAdminResponseDTO dto) {
        return userService.updateUser(userId, dto);
    }

    // 회원 삭제
    @DeleteMapping("/{userId}")
    public void deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId); // userId에 해당하는 회원을 삭제요청 보냄
    }
}
