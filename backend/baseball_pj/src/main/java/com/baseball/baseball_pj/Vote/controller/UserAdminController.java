package com.baseball.baseball_pj.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.baseball.baseball_pj.DTO.UserAdminResponseDTO;
import com.baseball.baseball_pj.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class UserAdminController {

    private final UserService userService;

    @GetMapping("/")
    public List<UserAdminResponseDTO> getAllUsers() {
        return userService.getAllUsers(); // Entity → DTO 변환하여 반환
    }
}
