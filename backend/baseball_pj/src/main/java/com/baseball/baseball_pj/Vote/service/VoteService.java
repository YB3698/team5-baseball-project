package com.baseball.baseball_pj.Vote.service;

import com.baseball.baseball_pj.User.domain.UserEntity;
import com.baseball.baseball_pj.User.repository.UserRepository;
import com.baseball.baseball_pj.Vote.DTO.VoteRequestDTO;
import com.baseball.baseball_pj.Vote.DTO.VoteResultDTO;
import com.baseball.baseball_pj.Vote.domain.PollEntity;
import com.baseball.baseball_pj.Vote.domain.VoteEntity;
import com.baseball.baseball_pj.Vote.domain.VoteOptionEntity;
import com.baseball.baseball_pj.Vote.repository.PollRepository;
import com.baseball.baseball_pj.Vote.repository.VoteOptionRepository;
import com.baseball.baseball_pj.Vote.repository.VoteRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 투표 서비스
 * - 사용자 투표 등록
 * - 투표 결과(선택지별 통계) 조회
 */
@Service
@RequiredArgsConstructor
public class VoteService {

    // 투표, 투표항목, 선택지, 사용자 관련 Repository 의존성 주입
    private final VoteRepository voteRepository;
    private final PollRepository pollRepository;
    private final VoteOptionRepository voteOptionRepository;
    private final UserRepository userRepository;

    /**
     * 사용자 투표 등록
     * 1. 이미 투표한 사용자인지 확인 (중복 투표 방지)
     * 2. 사용자, 투표, 선택지 엔티티 조회 및 검증
     * 3. 투표 엔티티 생성 및 저장
     * @param dto 투표 요청 DTO (userId, pollId, optionId)
     * @throws IllegalStateException 이미 투표한 경우
     * @throws RuntimeException 사용자/투표/선택지 정보가 없을 경우
     */
    public void vote(VoteRequestDTO dto) {
        // 이미 해당 투표에 참여한 사용자인지 확인
        voteRepository.findByUser_IdAndPoll_PollId(dto.getUserId(), dto.getPollId())
                .ifPresent(v -> { throw new IllegalStateException("이미 투표했습니다."); });

        // 사용자 정보 조회
        UserEntity user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("사용자 없음"));

        // 투표 항목 정보 조회
        PollEntity poll = pollRepository.findById(dto.getPollId())
                .orElseThrow(() -> new RuntimeException("투표 항목 없음"));

        // 선택지 정보 조회
        VoteOptionEntity option = voteOptionRepository.findById(dto.getOptionId())
                .orElseThrow(() -> new RuntimeException("선택지 없음"));

        // 투표 엔티티 생성 및 저장
        VoteEntity vote = VoteEntity.builder()
                .user(user)
                .poll(poll)
                .option(option)
                .votedAt(LocalDateTime.now())
                .build();

        voteRepository.save(vote);
    }

    /**
     * 투표 결과(선택지별 통계) 조회
     * 1. pollId에 해당하는 모든 투표 내역 조회
     * 2. 선택지(optionId)별로 투표 수 집계
     * 3. 각 선택지별 설명과 투표 수를 DTO로 변환
     * 4. 투표 수 내림차순 정렬
     * @param pollId 투표 항목 ID
     * @return 선택지별 투표 결과 리스트
     */
    public List<VoteResultDTO> getVoteResults(Long pollId) {
        // pollId에 해당하는 모든 투표 내역 조회
        List<VoteEntity> votes = voteRepository.findByPoll_PollId(pollId);

        // 선택지별로 투표 수 집계 및 결과 DTO 변환
        return votes.stream()
                .collect(Collectors.groupingBy(
                        v -> v.getOption().getOptionId(), // 선택지 ID 기준 그룹화
                        Collectors.counting() // 투표 수 집계
                ))
                .entrySet().stream()
                .map(e -> {
                    // 선택지 정보 조회 (설명 표시용)
                    VoteOptionEntity option = voteOptionRepository.findById(e.getKey()).orElse(null);
                    return VoteResultDTO.builder()
                            .optionId(e.getKey())
                            .description(option != null ? option.getDescription() : "Unknown")
                            .voteCount(e.getValue())
                            .build();
                })
                // 투표 수 내림차순 정렬
                .sorted(Comparator.comparingLong(VoteResultDTO::getVoteCount).reversed())
                .collect(Collectors.toList());
    }
}
