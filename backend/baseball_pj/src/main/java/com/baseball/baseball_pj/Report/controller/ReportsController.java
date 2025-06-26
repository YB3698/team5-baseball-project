package com.baseball.baseball_pj.Report.controller;

import org.springframework.web.bind.annotation.*;

import com.baseball.baseball_pj.Report.service.ReportsService;
import com.baseball.baseball_pj.Report.domain.ReportsEntity;
import com.baseball.baseball_pj.Report.dto.ReportWithPostIdDto;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportsController {
    private final ReportsService reportsService;

    public ReportsController(ReportsService reportsService) {
        this.reportsService = reportsService;
    }

    @GetMapping("/posts")
    public List<ReportWithPostIdDto> getPostReports() {
        return reportsService.getPostReportsWithNickname();
    }

    @GetMapping("/comments")
    public List<ReportWithPostIdDto> getCommentReports() {
        return reportsService.getCommentReportsWithPostId();
    }

    @PostMapping
    public ReportsEntity createReport(@RequestBody ReportsEntity report) {
        return reportsService.createReport(report);
    }

    @PutMapping("/{id}/status")
    public ReportsEntity updateReportStatus(@PathVariable Long id, @RequestBody StatusUpdateRequest req) {
        return reportsService.updateReportStatus(id, req.getStatus(), req.getAdminNote());
    }

    public static class StatusUpdateRequest {
        private String status;
        private String adminNote;

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public String getAdminNote() {
            return adminNote;
        }

        public void setAdminNote(String adminNote) {
            this.adminNote = adminNote;
        }
    }

    // 중복 신고 방지: 이미 신고했는지 체크
    @GetMapping("/check")
    public java.util.Map<String, Boolean> checkAlreadyReported(
            @RequestParam String reportType,
            @RequestParam Long targetId,
            @RequestParam Long reporterId) {
        boolean exists = reportsService.existsByReportTypeAndTargetIdAndReporterId(reportType, targetId, reporterId);
        java.util.Map<String, Boolean> result = new java.util.HashMap<>();
        result.put("alreadyReported", exists);
        return result;
    }
}