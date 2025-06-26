package com.baseball.baseball_pj.Report.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.baseball.baseball_pj.Report.repository.ReportsRepository;
import com.baseball.baseball_pj.Report.domain.ReportsEntity;
import com.baseball.baseball_pj.Post.repository.CommentRepository;
import com.baseball.baseball_pj.Post.domain.CommentEntity;
import com.baseball.baseball_pj.Report.dto.ReportWithPostIdDto;
import com.baseball.baseball_pj.Post.repository.PostRepository;
import com.baseball.baseball_pj.Post.domain.PostEntity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ReportsService {
    private final ReportsRepository reportsRepository;
    private final CommentRepository commentRepository;
    private final PostRepository postRepository;

    public ReportsService(ReportsRepository reportsRepository, CommentRepository commentRepository, PostRepository postRepository) {
        this.reportsRepository = reportsRepository;
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
    }

    public List<ReportsEntity> getReportsByType(String type) {
        // 게시글 신고일 때 닉네임 포함해서 반환
        if ("POST".equalsIgnoreCase(type)) {
            List<ReportsEntity> reports = reportsRepository.findByReportType(type.toUpperCase());
            for (ReportsEntity report : reports) {
                if (report.getTargetId() != null) {
                    PostEntity post = postRepository.findById(report.getTargetId()).orElse(null);
                    if (post != null && post.getUser() != null) {
                        // 임시로 adminNote에 닉네임을 넣는 등 하지 말고, 프론트에서 닉네임을 받을 수 있도록 DTO로 리턴하는 구조로 바꿔야 함
                        // 하지만 기존 getReportsByType은 ReportsEntity를 반환하므로, 프론트에서 /api/reports/posts도 DTO로 바꿔야 함
                    }
                }
            }
            return reports;
        }
        return reportsRepository.findByReportType(type.toUpperCase());
    }

    @Transactional
    public ReportsEntity createReport(ReportsEntity report) {
        report.setReportStatus("PENDING");
        report.setReportCreatedAt(LocalDateTime.now());
        return reportsRepository.save(report);
    }

    @Transactional
    public ReportsEntity updateReportStatus(Long reportId, String status, String adminNote) {
        ReportsEntity report = reportsRepository.findById(reportId)
            .orElseThrow(() -> new RuntimeException("신고 내역 없음"));
        report.setReportStatus(status);
        report.setAdminNote(adminNote);
        report.setProcessedAt(LocalDateTime.now());
        return reportsRepository.save(report);
    }

    @Transactional(readOnly = true)
    public boolean existsByReportTypeAndTargetIdAndReporterId(String reportType, Long targetId, Long reporterId) {
        return reportsRepository.countByReportTypeAndTargetIdAndReporterId(reportType, targetId, reporterId) > 0;
    }

    // 댓글 신고 리스트 반환 (postId 포함)
    public List<ReportWithPostIdDto> getCommentReportsWithPostId() {
        List<ReportsEntity> reports = reportsRepository.findByReportType("COMMENT");
        List<ReportWithPostIdDto> dtos = new ArrayList<>();
        for (ReportsEntity report : reports) {
            ReportWithPostIdDto dto = new ReportWithPostIdDto();
            dto.setReportId(report.getReportId());
            dto.setReportType(report.getReportType());
            dto.setTargetId(report.getTargetId());
            dto.setReporterId(report.getReporterId());
            dto.setReportReason(report.getReportReason());
            dto.setReportStatus(report.getReportStatus());
            dto.setAdminNote(report.getAdminNote());
            dto.setReportCreatedAt(report.getReportCreatedAt());
            dto.setProcessedAt(report.getProcessedAt());
            // 댓글ID로 댓글 엔티티 조회해서 postId, nickname 세팅
            CommentEntity comment = commentRepository.findById(report.getTargetId()).orElse(null);
            if (comment != null) {
                if (comment.getPost() != null) {
                    dto.setPostId(comment.getPost().getPostId());
                }
                if (comment.getUser() != null) {
                    dto.setNickname(comment.getUser().getNickname());
                }
            }
            dtos.add(dto);
        }
        return dtos;
    }

    // 게시글 신고 리스트 반환 (닉네임 포함 DTO)
    public List<ReportWithPostIdDto> getPostReportsWithNickname() {
        List<ReportsEntity> reports = reportsRepository.findByReportType("POST");
        List<ReportWithPostIdDto> dtos = new ArrayList<>();
        for (ReportsEntity report : reports) {
            ReportWithPostIdDto dto = new ReportWithPostIdDto();
            dto.setReportId(report.getReportId());
            dto.setReportType(report.getReportType());
            dto.setTargetId(report.getTargetId());
            dto.setReporterId(report.getReporterId());
            dto.setReportReason(report.getReportReason());
            dto.setReportStatus(report.getReportStatus());
            dto.setAdminNote(report.getAdminNote());
            dto.setReportCreatedAt(report.getReportCreatedAt());
            dto.setProcessedAt(report.getProcessedAt());
            // 게시글ID로 게시글 엔티티 조회해서 닉네임 세팅
            PostEntity post = postRepository.findById(report.getTargetId()).orElse(null);
            if (post != null && post.getUser() != null) {
                dto.setNickname(post.getUser().getNickname());
            }
            dtos.add(dto);
        }
        return dtos;
    }
}
