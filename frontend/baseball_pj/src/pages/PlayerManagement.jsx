import React, { useEffect, useState } from 'react';
import './PlayerManagement.css';

const PlayerManagement = () => {
  // 전체 회원 목록 상태
  const [users, setPlayers] = useState([]);
  // 더블클릭 시 선택된 회원 정보(수정/삭제용)
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  // 필터 입력값 상태
  const [filters, setFilters] = useState({ email: '', nickname: '', favoriteTeamId: '', role: '' });

  // 페이지네이션 관련 상태
  const ITEMS_PER_PAGE = 10; // 한 페이지에 보여줄 회원 수
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호

  // 컴포넌트 마운트 시 전체 회원 목록을 백엔드에서 받아옴
  useEffect(() => {
    fetch('/api/admin/players')
      .then(res => {return res.text();})
      .then(text => {
        const data = JSON.parse(text || '[]');
        setUsers(Array.isArray(data) ? data : []);
      })
  }, []);

  // 필터 입력값 변경 시 상태 업데이트
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // 필터링된 사용자 목록(이메일, 닉네임, 팀 ID, 권한으로 필터링)
  const filteredPlayers = players.filter(player => {
    return (
      player.email.includes(filters.email) &&
      player.nickname.includes(filters.nickname) &&
      String(player.favoriteTeamId).includes(filters.favoriteTeamId) &&
      player.role.includes(filters.role)
    );
  });

  // 현재 페이지에 보여줄 회원 목록만 추출
  const totalPages = Math.ceil(filteredPlayers.length / ITEMS_PER_PAGE);
  const paginatedPlayers = filteredPlayers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // 페이지네이션 버튼에 표시할 페이지 번호 목록 계산
  const getPageNumbers = () => {
    const visibleCount = 5; // 한 번에 보여줄 페이지 버튼 개수
    let start = Math.max(1, currentPage - Math.floor(visibleCount / 2));
    let end = start + visibleCount - 1;
    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - visibleCount + 1);
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  // 회원 정보 수정 폼 입력값 변경 시 상태 업데이트
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedPlayer({ ...selectedPlayer, [name]: value });
  };

  // 회원 정보 저장(수정) - PUT 요청
  const handleSave = () => {
    if (!selectedPlayer) return;
    fetch(`/api/admin/players/${selectedPlayer.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(selectedPlayer)
    })
      .then(res => res.text())
      .then(text => {
        try {
          const data = JSON.parse(text || '{}');
          setUsers(users.map(u => u.id === data.id ? data : u));
        } catch (e) {
          alert('수정 응답 파싱 오류: ' + e);
        }
        setSelectedUser(null);
      })
      .catch(err => alert('수정 실패: ' + err));
  };

  // 회원 삭제 - DELETE 요청
  const handleDelete = () => {
    if (!selectedPlayer) return;
    fetch(`/api/admin/players/${selectedPlayer.id}`, { method: 'DELETE' })
      .then(() => {
        setPlayers(players.filter(u => u.id !== selectedPlayer.id));
        setSelectedPlayer(null);
      })
      .catch(err => alert('삭제 실패: ' + err));
  };

  return (
    <div className="user-management-container">
      <h2 className="user-management-title">회원 관리</h2>
      {/* 필터 입력 영역 */}
      <div className="filter-section">
        <input name="email" placeholder="이메일" value={filters.email} onChange={handleFilterChange} />
        <input name="nickname" placeholder="닉네임" value={filters.nickname} onChange={handleFilterChange} />
        <input name="favoriteTeamId" placeholder="팀 ID" value={filters.favoriteTeamId} onChange={handleFilterChange} />
        <input name="role" placeholder="권한" value={filters.role} onChange={handleFilterChange} />
        <button className="search-btn">검색</button>
      </div>
      {/* 회원 정보 수정 폼 (행 더블클릭 시 노출) */}
      {selectedUser && (
        <div className="user-edit-form">
          <h4>회원 수정</h4>
          <label>
            이메일: <input name="email" value={selectedUser.email} onChange={handleEditChange} />
          </label>
          <label>
            닉네임: <input name="nickname" value={selectedUser.nickname} onChange={handleEditChange} />
          </label>
          <label>
            팀 ID: <input name="favoriteTeamId" value={selectedUser.favoriteTeamId} onChange={handleEditChange} />
          </label>
          <label>
            권한: <input name="role" value={selectedUser.role} onChange={handleEditChange} />
          </label>
          <div className="edit-form-buttons">
            <button className="save-btn" onClick={handleSave}>저장</button>
            <button className="delete-btn" onClick={handleDelete}>삭제</button>
          </div>
        </div>
      )}
      {/* 회원 목록 테이블 */}
      <table className="player-management-table">
        <thead>
          <tr>
            <th>이메일</th>
            <th>닉네임</th>
            <th>팀 ID</th>
            <th>권한</th>
            <th>가입일</th>
          </tr>
        </thead>
        <tbody>
          {paginatedPlayer.map(player => (
            <tr key={player.id} onDoubleClick={() => setSelectedPlayer(player)}>
              <td>{player.email}</td>
              <td>{player.nickname}</td>
              <td>{player.favoriteTeamId}</td>
              <td>{player.role}</td>
              <td>{player.createdAt?.split('T')[0]}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* 페이지네이션 버튼 */}
      <div className="pagination">
        <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>«</button>
        <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>‹</button>
        {getPageNumbers().map(num => (
          <button
            key={num}
            onClick={() => setCurrentPage(num)}
            className={num === currentPage ? 'active' : ''}
          >
            {num}
          </button>
        ))}
        <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>›</button>
        <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>»</button>
      </div>
    </div>
  );
};

export default PlayerManagement;
