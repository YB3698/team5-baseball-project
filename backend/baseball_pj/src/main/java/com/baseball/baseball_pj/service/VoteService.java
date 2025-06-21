package com.baseball.baseball_pj.service;

import com.baseball.baseball_pj.domain.PlayerEntity;
import com.baseball.baseball_pj.domain.UserEntity;
import com.baseball.baseball_pj.domain.VoteEntity;
import com.baseball.baseball_pj.repository.VoteRepository;
import com.baseball.baseball_pj.repository.PlayerRepository;
import com.baseball.baseball_pj.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 투표 관련 비즈니스 로직을 담당하는 서비스 클래스
 */
@Service
@RequiredArgsConstructor
public class VoteService {
    // 투표 엔티티 DB 접근용
    private final VoteRepository voteRepository;
    // 사용자 엔티티 DB 접근용
    private final UserRepository userRepository;
    // 선수 엔티티 DB 접근용
    private final PlayerRepository playerRepository;

    /**
     * 이미 해당 유저가 해당 선수에게 해당 poll(투표)에 투표했는지 확인
     * 
     * @param userId   사용자 PK
     * @param playerId 선수 PK
     * @param poll     투표 기간/이름
     * @return true: 이미 투표함, false: 아직 투표 안함
     */
    public boolean hasUserVoted(Long userId, Long playerId, String poll) {
        UserEntity user = userRepository.findById(userId).orElseThrow(); // userId로 UserEntity 조회
        PlayerEntity player = playerRepository.findById(playerId).orElseThrow(); // playerId로 PlayerEntity 조회
        return voteRepository.existsByUserAndPlayerAndPoll(user, player, poll); // 중복 투표 여부 반환
    }

    /**
     * 투표 저장(실제 투표 DB에 기록)
     * 
     * @param userId   사용자 PK
     * @param playerId 선수 PK
     * @param poll     투표 기간
     */
    @Transactional
    public void saveVote(Long userId, Long playerId, String poll) {
        UserEntity user = userRepository.findById(userId).orElseThrow(); // userId로 UserEntity 조회
        PlayerEntity player = playerRepository.findById(playerId).orElseThrow(); // playerId로 PlayerEntity 조회
        VoteEntity vote = VoteEntity.builder()
                .user(user) // 투표한 유저
                .player(player) // 투표 대상 선수
                .poll(poll) // 투표 기간/이름
                .build();
        voteRepository.save(vote); // 투표 DB에 저장
    }
}
