import React, { useState, useEffect } from 'react';
import './Management.css';

const ReportManagement = () => {
  const [reports, setReports] = useState([]);
  const [activeReportTab, setActiveReportTab] = useState('post'); // 'post' 또는 'comment'
  const [loading, setLoading] = useState(false);

  // 더미 데이터 (실제 API 구현 시 삭제)
  const dummyPostReports = [
    {
      reportId: 1,
      reportType: 'POST',
      targetId: 101,
      targetTitle: '야구 경기 결과 예측',
      targetAuthor: '야구팬123',
      reporterNickname: '신고자1',
      reportReason: '스팸/광고',
      reportStatus: 'PENDING',
      reportCreatedAt: '2025-06-25T10:30:00',
    },
    {
      reportId: 2,
      reportType: 'POST',
      targetId: 102,
      targetTitle: '선수 이적설 관련 정보',
      targetAuthor: '베이스볼러',
      reporterNickname: '신고자2',
      reportReason: '허위정보',
      reportStatus: 'APPROVED',
      reportCreatedAt: '2025-06-24T15:20:00',
    }
  ];

  const dummyCommentReports = [
    {
      reportId: 3,
      reportType: 'COMMENT',
      targetId: 201,
      targetTitle: '경기 정말 재미있었네요...',
      targetAuthor: '댓글러',
      reporterNickname: '신고자3',
      reportReason: '욕설/비방',
      reportStatus: 'PENDING',
      reportCreatedAt: '2025-06-25T09:15:00',
    }
  ];

  // 신고 목록 조회
  const fetchReports = async () => {
    setLoading(true);
    try {
      // 실제 API 호출 (백엔드 구현 시 활성화)
      /*
      const endpoint = activeReportTab === 'post' ? '/api/reports/posts' : '/api/reports/comments';
      const response = await fetch(endpoint, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setReports(data);
      }
      */
      
      // 더미 데이터 사용 (임시)
      if (activeReportTab === 'post') {
        setReports(dummyPostReports);
      } else {
        setReports(dummyCommentReports);
      }
    } catch (error) {
      console.error('신고 목록 조회 실패:', error);
      // 에러 시 더미 데이터 사용
      if (activeReportTab === 'post') {
        setReports(dummyPostReports);
      } else {
        setReports(dummyCommentReports);
      }
    } finally {
      setLoading(false);
    }
  };

  // 신고 처리 (승인/거부/삭제)
  const handleReportAction = async (reportId, action, adminNote = '') => {
    try {
      // 실제 API 호출 (백엔드 구현 시 활성화)
      /*
      const response = await fetch(`/api/reports/${reportId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          status: action,
          adminNote: adminNote
        })
      });
      
      if (response.ok) {
        alert(`신고가 ${getActionText(action)}되었습니다.`);
        fetchReports(); // 목록 새로고침
      }
      */
      
      // 더미 처리 (임시)
      setReports(prevReports => 
        prevReports.map(report => 
          report.reportId === reportId 
            ? { ...report, reportStatus: action, processedAt: new Date().toISOString() }
            : report
        )
      );
      alert(`신고가 ${getActionText(action)}되었습니다.`);
      
    } catch (error) {
      console.error('신고 처리 실패:', error);
      alert('신고 처리에 실패했습니다.');
    }
  };

  const getActionText = (action) => {
    switch (action) {
      case 'APPROVED': return '승인';
      case 'REJECTED': return '거부';
      case 'DELETED': return '삭제';
      default: return '처리';
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'PENDING': { text: '대기중', class: 'status-pending' },
      'APPROVED': { text: '승인됨', class: 'status-approved' },
      'REJECTED': { text: '거부됨', class: 'status-rejected' },
      'DELETED': { text: '삭제됨', class: 'status-deleted' }
    };
    
    const config = statusConfig[status] || { text: status, class: 'status-unknown' };
    return <span className={`status-badge ${config.class}`}>{config.text}</span>;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR') + ' ' + date.toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  useEffect(() => {
    fetchReports();
  }, [activeReportTab]);

  return (
    <div className="report-management">
      <h3>신고 관리</h3>
      
      {/* 탭 메뉴 */}
      <div className="report-tabs">
        <button
          className={activeReportTab === 'post' ? 'active' : ''}
          onClick={() => setActiveReportTab('post')}
        >
          게시글 신고
        </button>
        <button
          className={activeReportTab === 'comment' ? 'active' : ''}
          onClick={() => setActiveReportTab('comment')}
        >
          댓글 신고
        </button>
      </div>

      {/* 신고 목록 */}
      <div className="report-list">
        {loading ? (
          <div className="loading">로딩 중...</div>
        ) : reports.length === 0 ? (
          <div className="no-reports">신고 내역이 없습니다.</div>
        ) : (
          <div className="report-table-container">
            <table className="report-table">
              <thead>
                <tr>
                  <th>신고일시</th>
                  <th>신고자</th>
                  <th>신고 대상</th>
                  <th>작성자</th>
                  <th>신고 사유</th>
                  <th>상태</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.reportId}>
                    <td>{formatDate(report.reportCreatedAt)}</td>
                    <td>{report.reporterNickname}</td>
                    <td className="target-content">
                      <div className="target-title">
                        {report.targetTitle}
                      </div>
                      <div className="target-id">
                        ID: {report.targetId}
                      </div>
                    </td>
                    <td>{report.targetAuthor}</td>
                    <td>{report.reportReason}</td>
                    <td>{getStatusBadge(report.reportStatus)}</td>
                    <td>
                      {report.reportStatus === 'PENDING' ? (
                        <div className="action-buttons">
                          <button
                            className="btn-approve"
                            onClick={() => handleReportAction(report.reportId, 'APPROVED')}
                            title="신고를 승인하고 해당 게시글/댓글을 처리합니다"
                          >
                            승인
                          </button>
                          <button
                            className="btn-reject"
                            onClick={() => handleReportAction(report.reportId, 'REJECTED')}
                            title="신고를 거부합니다"
                          >
                            거부
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => {
                              if (window.confirm('정말로 해당 게시글/댓글을 삭제하시겠습니까?')) {
                                handleReportAction(report.reportId, 'DELETED');
                              }
                            }}
                            title="해당 게시글/댓글을 삭제합니다"
                          >
                            삭제
                          </button>
                        </div>
                      ) : (
                        <span className="processed">처리완료</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 새로고침 버튼 */}
      <div className="report-actions">
        <button 
          className="refresh-btn"
          onClick={fetchReports}
          disabled={loading}
        >
          {loading ? '로딩 중...' : '새로고침'}
        </button>
      </div>
    </div>
  );
};

export default ReportManagement;
