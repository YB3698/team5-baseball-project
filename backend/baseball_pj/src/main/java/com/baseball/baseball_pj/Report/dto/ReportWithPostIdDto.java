package com.baseball.baseball_pj.Report.dto;

import java.time.LocalDateTime;

public class ReportWithPostIdDto {
    private Long reportId;
    private String reportType;
    private Long targetId;
    private Long reporterId;
    private String reportReason;
    private String reportStatus;
    private String adminNote;
    private LocalDateTime reportCreatedAt;
    private LocalDateTime processedAt;
    private Long postId; // 댓글이 달린 게시글 ID (댓글 신고일 때만)
    private String nickname; // 작성자 닉네임(게시글/댓글)

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
    public Long getPostId() { return postId; }
    public void setPostId(Long postId) { this.postId = postId; }
    public String getNickname() { return nickname; }
    public void setNickname(String nickname) { this.nickname = nickname; }
}
