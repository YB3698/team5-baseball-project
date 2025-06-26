package com.baseball.baseball_pj.Report.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "REPORTS", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"REPORT_TYPE", "TARGET_ID", "REPORTER_ID"})
})
public class ReportsEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "report_seq")
    @SequenceGenerator(name = "report_seq", sequenceName = "SEQ_REPORT_ID", allocationSize = 1)
    private Long reportId;

    private String reportType; // 'POST' or 'COMMENT'
    private Long targetId;
    private Long reporterId;
    private String reportReason;
    private String reportStatus;
    private String adminNote;
    private LocalDateTime reportCreatedAt;
    private LocalDateTime processedAt;

    // getter/setter
    public Long getReportId() { return reportId; }
    public void setReportId(Long reportId) { this.reportId = reportId; }

    public String getReportType() { return reportType; }
    public void setReportType(String reportType) { this.reportType = reportType; }

    public Long getTargetId() { return targetId; }
    public void setTargetId(Long targetId) { this.targetId = targetId; }

    public Long getReporterId() { return reporterId; }
    public void setReporterId(Long reporterId) { this.reporterId = reporterId; }

    public String getReportReason() { return reportReason; }
    public void setReportReason(String reportReason) { this.reportReason = reportReason; }

    public String getReportStatus() { return reportStatus; }
    public void setReportStatus(String reportStatus) { this.reportStatus = reportStatus; }

    public String getAdminNote() { return adminNote; }
    public void setAdminNote(String adminNote) { this.adminNote = adminNote; }

    public LocalDateTime getReportCreatedAt() { return reportCreatedAt; }
    public void setReportCreatedAt(LocalDateTime reportCreatedAt) { this.reportCreatedAt = reportCreatedAt; }

    public LocalDateTime getProcessedAt() { return processedAt; }
    public void setProcessedAt(LocalDateTime processedAt) { this.processedAt = processedAt; }
}