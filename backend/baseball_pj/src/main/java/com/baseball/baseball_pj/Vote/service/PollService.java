package com.baseball.baseball_pj.Vote.service;

import com.baseball.baseball_pj.Vote.DTO.PollRequestDTO;
import com.baseball.baseball_pj.Vote.DTO.PollResponseDTO;
import com.baseball.baseball_pj.Vote.DTO.VoteOptionRequestDTO;
import com.baseball.baseball_pj.Vote.domain.PollEntity;
import com.baseball.baseball_pj.Vote.domain.VoteOptionEntity;
import com.baseball.baseball_pj.Vote.repository.PollRepository;
import com.baseball.baseball_pj.Vote.repository.VoteOptionRepository;
import com.baseball.baseball_pj.Vote.repository.VoteRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PollService {

    private final PollRepository pollRepository;
    private final VoteOptionRepository voteOptionRepository;
    private final VoteRepository voteRepository;

    // ✅ 투표 항목(POLL) 등록
    public PollResponseDTO createPoll(PollRequestDTO dto) {
        PollEntity poll = PollEntity.builder()
                .pollTitle(dto.getPollTitle())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .isActive(dto.getIsActive())
                .build();

        PollEntity saved = pollRepository.save(poll);

        return PollResponseDTO.builder()
                .pollId(saved.getPollId())
                .pollTitle(saved.getPollTitle())
                .startDate(saved.getStartDate())
                .endDate(saved.getEndDate())
                .isActive(saved.getIsActive())
                .build();
    }

    // ✅ 전체 투표 항목 조회
    public List<PollResponseDTO> getAllPolls() {
        return pollRepository.findAll().stream()
                .map(p -> PollResponseDTO.builder()
                        .pollId(p.getPollId())
                        .pollTitle(p.getPollTitle())
                        .startDate(p.getStartDate())
                        .endDate(p.getEndDate())
                        .isActive(p.getIsActive())
                        .build())
                .collect(Collectors.toList());
    }

    // ✅ 투표 항목 활성화/비활성화
    public void updatePollStatus(Long pollId, String isActive) {
        PollEntity poll = pollRepository.findById(pollId)
                .orElseThrow(() -> new RuntimeException("해당 투표 항목 없음"));

        poll.setIsActive(isActive);
        pollRepository.save(poll);
    }

    // ✅ 선택지(옵션) 등록
    public void createOption(VoteOptionRequestDTO dto) {
        PollEntity poll = pollRepository.findById(dto.getPollId())
                .orElseThrow(() -> new RuntimeException("투표 항목이 존재하지 않습니다."));

        VoteOptionEntity option = VoteOptionEntity.builder()
                .poll(poll)
                .description(dto.getDescription())
                .build();

        voteOptionRepository.save(option);
    }

    // ✅ 선택지(옵션) 삭제
    public void deleteOption(Long pollId, Long optionId) {
        VoteOptionEntity option = voteOptionRepository.findById(optionId)
                .orElseThrow(() -> new RuntimeException("해당 선택지가 존재하지 않습니다."));
        // pollId 일치 여부 체크(보안)
        if (!option.getPoll().getPollId().equals(pollId)) {
            throw new RuntimeException("투표 항목과 선택지 정보가 일치하지 않습니다.");
        }
        voteOptionRepository.delete(option);
    }

    // ✅ 선택지(옵션) 수정
    public void updateOption(VoteOptionRequestDTO dto) {
        VoteOptionEntity option = voteOptionRepository.findById(dto.getOptionId())
                .orElseThrow(() -> new RuntimeException("해당 선택지가 존재하지 않습니다."));
        option.setDescription(dto.getDescription());
        voteOptionRepository.save(option);
    }

    // ✅ 특정 항목에 속한 선택지 목록 조회
    public List<VoteOptionEntity> getOptionsByPollId(Long pollId) {
        return voteOptionRepository.findByPoll_PollId(pollId);
    }

    // 투표 항목 수정
public void updatePoll(Long pollId, PollRequestDTO dto) {
    PollEntity poll = pollRepository.findById(pollId)
        .orElseThrow(() -> new RuntimeException("해당 투표 항목 없음"));
    poll.setPollTitle(dto.getPollTitle());
    poll.setStartDate(dto.getStartDate());
    poll.setEndDate(dto.getEndDate());
    pollRepository.save(poll);
}

@Transactional
    public void deletePoll(Long pollId) {
        // 1. 투표 기록 삭제
        voteRepository.deleteByPoll_PollId(pollId);

        // 2. 선택지 삭제
        voteOptionRepository.deleteByPoll_PollId(pollId);

        // 3. 투표 항목 삭제
        pollRepository.deleteById(pollId);
    }
}
