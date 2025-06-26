package com.baseball.baseball_pj.Report.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.baseball.baseball_pj.Report.domain.ReportsEntity;

public interface ReportsRepository extends JpaRepository<ReportsEntity, Long> {
    List<ReportsEntity> findByReportType(String reportType);
    long countByReportTypeAndTargetIdAndReporterId(String reportType, Long targetId, Long reporterId);
}
