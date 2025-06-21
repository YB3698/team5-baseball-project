package com.baseball.baseball_pj.service;

import com.baseball.baseball_pj.domain.PlayerEntity;
import com.baseball.baseball_pj.domain.UserEntity;
import com.baseball.baseball_pj.domain.VoteEntity;
import com.baseball.baseball_pj.domain.PollEntity;
import com.baseball.baseball_pj.repository.VoteRepository;
import com.baseball.baseball_pj.repository.PlayerRepository;
import com.baseball.baseball_pj.repository.UserRepository;
import com.baseball.baseball_pj.repository.PollRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// service는 컨트롤러가 사용자의 요청을 받으면 db에 투표 내용을 저장하거나 확인해줌
@Service
@RequiredArgsConstructor // final로 선언된 필드들에 대해 자동으로 생성자 생성
public class VoteService {
    // 투표 엔티티 DB 접근용
    private final VoteRepository voteRepository;
    // 사용자 엔티티 DB 접근용
    private final UserRepository userRepository;
    // 선수 엔티티 DB 접근용
    private final PlayerRepository playerRepository;
    // 투표내용 엔티티 DB 접근용
    private final PollRepository pollRepository;

    // 투표 여부 확인(사용자가 특정 선수에 대해 투표했는지 확인)
    public boolean hasUserVoted(Long userId, Long playerId, Long pollId) {
        UserEntity id = userRepository.findById(userId).orElseThrow();
        PlayerEntity playerid = playerRepository.findById(playerId).orElseThrow();
        PollEntity pollid = pollRepository.findById(pollId).orElseThrow();
        return voteRepository.existsByUserIdAndPlayerIdAndPollId(userId, playerId, pollId); // 이 조합으로 투표한게 있는지 확인(true/false 반환)
    }

    // 투표 저장 로직
    @Transactional
    public void saveVote(Long userId, Long playerId, Long pollId) {
        UserEntity user = userRepository.findById(userId).orElseThrow();
        PlayerEntity player = playerRepository.findById(playerId).orElseThrow();
        PollEntity poll = pollRepository.findById(pollId).orElseThrow();
        VoteEntity vote = VoteEntity.builder()
                .userId(user)
                .playerId(player)
                .pollId(poll)
                .build();
        voteRepository.save(vote); // 투표 DB에 저장
    }
}
