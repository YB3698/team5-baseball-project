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

@Service
@RequiredArgsConstructor
public class VoteService {

    private final VoteRepository voteRepository;
    private final PollRepository pollRepository;
    private final VoteOptionRepository voteOptionRepository;
    private final UserRepository userRepository;

    // ✅ 사용자 투표 등록
    public void vote(VoteRequestDTO dto) {
        voteRepository.findByUser_IdAndPoll_PollId(dto.getUserId(), dto.getPollId())
                .ifPresent(v -> { throw new IllegalStateException("이미 투표했습니다."); });

        UserEntity user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("사용자 없음"));

        PollEntity poll = pollRepository.findById(dto.getPollId())
                .orElseThrow(() -> new RuntimeException("투표 항목 없음"));

        VoteOptionEntity option = voteOptionRepository.findById(dto.getOptionId())
                .orElseThrow(() -> new RuntimeException("선택지 없음"));

        VoteEntity vote = VoteEntity.builder()
                .user(user)
                .poll(poll)
                .option(option)
                .votedAt(LocalDateTime.now())
                .build();

        voteRepository.save(vote);
    }

    // ✅ 투표 결과 (항목별 선택지 통계)
    public List<VoteResultDTO> getVoteResults(Long pollId) {
        List<VoteEntity> votes = voteRepository.findByPoll_PollId(pollId);

        return votes.stream()
                .collect(Collectors.groupingBy(
                        v -> v.getOption().getOptionId(),
                        Collectors.counting()
                ))
                .entrySet().stream()
                .map(e -> {
                    VoteOptionEntity option = voteOptionRepository.findById(e.getKey()).orElse(null);
                    return VoteResultDTO.builder()
                            .optionId(e.getKey())
                            .description(option != null ? option.getDescription() : "Unknown")
                            .voteCount(e.getValue())
                            .build();
                })
                .sorted(Comparator.comparingLong(VoteResultDTO::getVoteCount).reversed())
                .collect(Collectors.toList());
    }
}
