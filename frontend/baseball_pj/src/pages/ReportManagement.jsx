import React, { useState, useEffect } from 'react';
import './Management.css';

const ReportManagement = () => {
  const [reports, setReports] = useState([]);
  const [activeReportTab, setActiveReportTab] = useState('post'); // 'post' 또는 'comment'
  const [loading, setLoading] = useState(false);

  // 실제 신고 목록 조회
  const fetchReports = async () => {
    setLoading(true);
    try {
      const endpoint = activeReportTab === 'post' ? '/api/reports/posts' : '/api/reports/comments';
      const response = await fetch(endpoint, { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        // 최신 날짜순(신고일시 내림차순) 정렬
        const sorted = data.sort((a, b) => new Date(b.reportCreatedAt) - new Date(a.reportCreatedAt));
        setReports(sorted);
      } else {
        setReports([]);
      }
    } catch (error) {
      console.error('신고 목록 조회 실패:', error);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  // 신고 처리 (승인/거부)
  const handleReportAction = async (report, action, adminNote = '') => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const adminId = storedUser?.userId;
      const adminRole = storedUser?.role;
      if (action === 'APPROVED') {
        // 게시글/댓글 삭제 API 호출
        const headers = {
          'Content-Type': 'application/json',
          'X-USER-ID': adminId,
          'X-USER-ROLE': adminRole,
        };
        if (report.reportType === 'POST') {
          await fetch(`/api/posts/${report.targetId}`, {
            method: 'DELETE',
            headers: headers,
            credentials: 'include',
            body: JSON.stringify({ userId: adminId, role: adminRole })
          });
        } else if (report.reportType === 'COMMENT') {
          await fetch(`/api/comments/${report.targetId}`, {
            method: 'DELETE',
            headers: headers,
            credentials: 'include',
            body: JSON.stringify({ userId: adminId, role: adminRole })
          });
        }
      }
      // 신고 상태 변경
      const response = await fetch(`/api/reports/${report.reportId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: action, adminNote: adminNote })
      });
      if (response.ok) {
        alert(`신고가 ${getActionText(action)}되었습니다.`);
        fetchReports(); // 목록 새로고침
      } else {
        alert('신고 처리에 실패했습니다.');
      }
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
                  <th>신고자(ID)</th>
                  <th>작성자(ID)</th>
                  <th>신고 사유</th>
                  <th>상태</th>
                  <th>신고대상ID</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.reportId}>
                    <td>{formatDate(report.reportCreatedAt)}</td>
                    <td>{report.reporterId}</td>
                    <td>{report.nickname ? `${report.nickname} (${report.targetId})` : report.targetId}</td>
                    <td>{report.reportReason}</td>
                    <td>{getStatusBadge(report.reportStatus)}</td>
                    <td>
                      {/* 게시글 신고: postId(=targetId)로 이동, 댓글 신고: commentId(=targetId)로 이동 */}
                      {report.reportType === 'POST' ? (
                        <a href={`/board/${report.targetId}`} target="_blank" rel="noopener noreferrer">{report.targetId}</a>
                      ) : (
                        // 댓글 신고: postId가 있으면 해당 게시글 내 commentId로 이동(anchor)
                        report.postId ? (
                          <a href={`/board/${report.postId}#comment-${report.targetId}`} target="_blank" rel="noopener noreferrer">{report.targetId}</a>
                        ) : (
                          <span>{report.targetId}</span>
                        )
                      )}
                    </td>
                    <td>
                      {report.reportStatus === 'PENDING' ? (
                        <div className="action-buttons">
                          <button
                            className="btn-approve"
                            onClick={() => handleReportAction(report, 'APPROVED')}
                            title="신고를 승인하고 해당 게시글/댓글을 삭제합니다"
                          >
                            승인
                          </button>
                          <button
                            className="btn-reject"
                            onClick={() => handleReportAction(report, 'REJECTED')}
                            title="신고를 거부합니다"
                          >
                            거부
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
