package com.baseball.baseball_pj.Report.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.baseball.baseball_pj.Report.repository.ReportsRepository;
import com.baseball.baseball_pj.Report.domain.ReportsEntity;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReportsService {
    private final ReportsRepository reportsRepository;

    public ReportsService(ReportsRepository reportsRepository) {
        this.reportsRepository = reportsRepository;
    }

    public List<ReportsEntity> getReportsByType(String type) {
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
}
