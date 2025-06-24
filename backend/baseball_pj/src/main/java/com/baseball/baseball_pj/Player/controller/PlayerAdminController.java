package com.baseball.baseball_pj.Player.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.baseball.baseball_pj.Player.DTO.PlayerAdminRequestDTO;
import com.baseball.baseball_pj.Player.DTO.PlayerAdminResponseDTO;
import com.baseball.baseball_pj.Player.service.PlayerAdminService;

import lombok.*;

@RestController // API 요청을 처리하는 컨트롤러임을 의미(json 형태로 응답)
@RequestMapping("/api/admin/players") // 이 클래스 안의 모든 API는 /api/admin/players 경로로 시작
@RequiredArgsConstructor // final로 선언된 변수는 자동으로 생성자 주입
public class PlayerAdminController {
    private final PlayerAdminService playerAdminService; // PlayerAdminService를 주입받아 사용
    
    // 선수 추가
    @PostMapping // POST 요청을 처리하는 메서드
    public PlayerAdminResponseDTO addPlayer(@RequestBody PlayerAdminRequestDTO dto) {
        return playerAdminService.addPlayer(dto);
    }

    // 전체 선수 목록 조회
    @GetMapping
    public List<PlayerAdminResponseDTO> getAllPlayers() { // entity → DTO 변환하여 반환
        return playerAdminService.getAllPlayers(); // json 형태로 반환
    }

    // 단일 선수 조회
    @GetMapping("/{playerId}")
    public PlayerAdminResponseDTO getPlayer(@PathVariable Long playerId) { // @PathVariable로 URL 경로에서 playerId를 추출
        return playerAdminService.getPlayer(playerId); // playerId에 해당하는 선수 정보를 조회하여 반환
    }

    // 선수 정보 수정
    @PutMapping("/{playerId}")
    public PlayerAdminResponseDTO updatePlayer(@PathVariable Long playerId, @RequestBody PlayerAdminRequestDTO dto) {
        return playerAdminService.updatePlayer(playerId, dto);
    }

    // 선수 삭제
    @DeleteMapping("/{playerId}")
    public void deletePlayer(@PathVariable Long playerId) {
        playerAdminService.deletePlayer(playerId); // playerId에 해당하는 선수를 삭제요청 보냄
    }
}