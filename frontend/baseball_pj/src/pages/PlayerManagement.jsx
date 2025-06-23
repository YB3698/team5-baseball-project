import React, { useEffect, useState } from 'react';

const PlayerManagement = () => {
  // 전체 선수 목록 상태
  const [players, setPlayers] = useState([]);
  // 더블클릭 시 선택된 선수 정보(수정/삭제용)
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  // 필터 입력값 상태
  const [filters, setFilters] = useState({ playerId: '', playerName: '', playerPosition: '', playerBackNumber: '', playerBirthDate: '', playerHeightWeight: '', playerEducationPath: '', teamId: '' });

  // 페이지네이션 관련 상태
  const ITEMS_PER_PAGE = 10; // 한 페이지에 보여줄 선수 수
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호

  // 컴포넌트 마운트 시 전체 선수 목록을 백엔드에서 받아옴
  useEffect(() => {
    fetch('/api/admin/players')
      .then(res => res.text())
      .then(text => {
        const data = JSON.parse(text || '[]');
        setPlayers(Array.isArray(data) ? data : []);
      })
      .catch(() => setPlayers([]));
  }, []);

  // 필터 입력값 변경 시 상태 업데이트
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // 필터링된 선수 목록
  const filteredPlayers = players.filter(player => {
    return (
      String(player.playerId || '').includes(filters.playerId) &&
      (player.playerName || '').includes(filters.playerName) &&
      (player.playerPosition || '').includes(filters.playerPosition) &&
      String(player.playerBackNumber || '').includes(filters.playerBackNumber) &&
      String(player.playerBirthDate || '').includes(filters.playerBirthDate) &&
      (player.playerHeightWeight || '').includes(filters.playerHeightWeight) &&
      (player.playerEducationPath || '').includes(filters.playerEducationPath) &&
      String(player.teamId || '').includes(filters.teamId)
    );
  });

  // 현재 페이지에 보여줄 선수 목록만 추출
  const totalPages = Math.ceil(filteredPlayers.length / ITEMS_PER_PAGE) || 1;
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

  // 선수 정보 수정 폼 입력값 변경 시 상태 업데이트
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedPlayer({ ...selectedPlayer, [name]: value });
  };

  // 선수 정보 저장(수정) - PUT 요청
  const handleSave = () => {
    if (!selectedPlayer) return;
    // 숫자/날짜 필드 변환
    const payload = {
      ...selectedPlayer,
      playerBackNumber: selectedPlayer.playerBackNumber ? Number(selectedPlayer.playerBackNumber) : null,
      teamId: selectedPlayer.teamId ? Number(selectedPlayer.teamId) : null,
      playerBirthDate: selectedPlayer.playerBirthDate || null
    };
    fetch(`/api/admin/players/${selectedPlayer.playerId}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(res => res.text())
      .then(text => {
        try {
          const data = JSON.parse(text || '{}');
          setPlayers(players.map(u => u.playerId === data.playerId ? data : u));
        } catch (e) {
          alert('수정 응답 파싱 오류: ' + e);
        }
        setSelectedPlayer(null);
      })
      .catch(err => alert('수정 실패: ' + err));
  };

  // 선수 삭제 - DELETE 요청
  const handleDelete = () => {
    if (!selectedPlayer) return;
    fetch(`/api/admin/players/${selectedPlayer.playerId}`, { method: 'DELETE' })
      .then(() => {
        setPlayers(players.filter(u => u.playerId !== selectedPlayer.playerId));
        setSelectedPlayer(null);
      })
      .catch(err => alert('삭제 실패: ' + err));
  };

  return (
    <div className="player-management-container">
      <h2 className="player-management-title">선수 관리</h2>
      {/* 필터 입력 영역 */}
      <div className="filter-section">
        <input name="playerId" placeholder="선수 ID" value={filters.playerId} onChange={handleFilterChange} />
        <input name="playerName" placeholder="선수 이름" value={filters.playerName} onChange={handleFilterChange} />
        <input name="playerPosition" placeholder="포지션" value={filters.playerPosition} onChange={handleFilterChange} />
        <input name="playerBackNumber" placeholder="등번호" value={filters.playerBackNumber} onChange={handleFilterChange} />
        <input name="playerBirthDate" placeholder="생년월일(YYYY-MM-DD)" value={filters.playerBirthDate} onChange={handleFilterChange} />
        <input name="playerHeightWeight" placeholder="키/몸무게" value={filters.playerHeightWeight} onChange={handleFilterChange} />
        <input name="playerEducationPath" placeholder="학력" value={filters.playerEducationPath} onChange={handleFilterChange} />
        <input name="teamId" placeholder="팀 ID" value={filters.teamId} onChange={handleFilterChange} />
      </div>
      {/* 선수 정보 수정 폼 (행 더블클릭 시 노출) */}
      {selectedPlayer && (
        <div className="player-edit-form">
          <h4>선수 수정</h4>
          <label>
            이름: <input name="playerName" value={selectedPlayer.playerName || ''} onChange={handleEditChange} />
          </label>
          <label>
            포지션: <input name="playerPosition" value={selectedPlayer.playerPosition || ''} onChange={handleEditChange} />
          </label>
          <label>
            등번호: <input name="playerBackNumber" value={selectedPlayer.playerBackNumber || ''} onChange={handleEditChange} />
          </label>
          <label>
            생년월일: <input name="playerBirthDate" value={selectedPlayer.playerBirthDate || ''} onChange={handleEditChange} placeholder="YYYY-MM-DD" />
          </label>
          <label>
            키/몸무게: <input name="playerHeightWeight" value={selectedPlayer.playerHeightWeight || ''} onChange={handleEditChange} />
          </label>
          <label>
            학력: <input name="playerEducationPath" value={selectedPlayer.playerEducationPath || ''} onChange={handleEditChange} />
          </label>
          <label>
            팀 ID: <input name="teamId" value={selectedPlayer.teamId || ''} onChange={handleEditChange} />
          </label>
          <div className="edit-form-buttons">
            <button className="save-btn" onClick={handleSave}>저장</button>
            <button className="delete-btn" onClick={handleDelete}>삭제</button>
            <button className="cancel-btn" onClick={() => setSelectedPlayer(null)}>취소</button>
          </div>
        </div>
      )}
      {/* 선수 목록 테이블 */}
      <table className="player-management-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>이름</th>
            <th>포지션</th>
            <th>등번호</th>
            <th>생년월일</th>
            <th>키/몸무게</th>
            <th>학력</th>
            <th>팀 ID</th>
          </tr>
        </thead>
        <tbody>
          {paginatedPlayers.map(player => (
            <tr key={player.playerId} onDoubleClick={() => setSelectedPlayer(player)}>
              <td>{player.playerId}</td>
              <td>{player.playerName}</td>
              <td>{player.playerPosition}</td>
              <td>{player.playerBackNumber}</td>
              <td>{player.playerBirthDate}</td>
              <td>{player.playerHeightWeight}</td>
              <td>{player.playerEducationPath}</td>
              <td>{player.teamId}</td>
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
