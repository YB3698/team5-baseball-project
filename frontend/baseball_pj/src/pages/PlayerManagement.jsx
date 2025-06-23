import React, { useEffect, useState } from 'react';
import PlayerManagement from './PlayerManagement';
import './PlayerManagement.css';

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
      .then(res => {return res.text();})
      .then(text => {
        const data = JSON.parse(text || '[]');
        console.log('전체 선수 목록:', data);
        setPlayers(Array.isArray(data) ? data : []);
      })
  }, []);

  // 필터 입력값 변경 시 상태 업데이트
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // 필터링된 선수 목록(이메일, 닉네임, 팀 ID, 권한으로 필터링)
  const filteredPlayers = players.filter(player => {
    return (
      player.playerName.includes(filters.playerName) &&
      player.playerPosition.includes(filters.playerPosition) &&
      String(player.playerBackNumber).includes(filters.playerBackNumber) &&
      String(player.playerBirthDate).includes(filters.playerBirthDate) &&
      player.playerHeightWeight.includes(filters.playerHeightWeight) &&
      player.playerEducationPath.includes(filters.playerEducationPath) &&
      String(player.teamId).includes(filters.teamId)
    );
  });

  // 현재 페이지에 보여줄 선수 목록만 추출
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

  // 선수 정보 수정 폼 입력값 변경 시 상태 업데이트
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedPlayer({ ...selectedPlayer, [name]: value });
  };

  // 선수 정보 저장(수정) - PUT 요청
  const handleSave = () => {
    if (!selectedPlayer) return;
    fetch(`/api/admin/players/${selectedPlayer.playerId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(selectedPlayer)
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
        <input name="playerPosition" placeholder="선수 포지션" value={filters.playerPosition} onChange={handleFilterChange} />
        <input name="playerBackNumber" placeholder="선수 등번호" value={filters.playerBackNumber} onChange={handleFilterChange} />
        <input name="playerBirthDate" placeholder="선수 생일" value={filters.playerBirthDate} onChange={handleFilterChange} />
        <input name="playerHeightWeight" placeholder="선수 키/몸무게" value={filters.playerHeightWeight} onChange={handleFilterChange} />
        <input name="playerEducationPath" placeholder="선수 학력" value={filters.playerEducationPath} onChange={handleFilterChange} />
        <input name="teamId" placeholder="팀 ID" value={filters.teamId} onChange={handleFilterChange} />
        <button className="search-btn">검색</button>
      </div>
      {/* 선수 정보 수정 폼 (행 더블클릭 시 노출) */}
      {selectedPlayer && (
        <div className="player-edit-form">
          <h4>선수 수정</h4>
          <label>
            이메일: <input name="email" value={selectedPlayer.email} onChange={handleEditChange} />
          </label>
          <label>
            닉네임: <input name="nickname" value={selectedPlayer.nickname} onChange={handleEditChange} />
          </label>
          <label>
            팀 ID: <input name="favoriteTeamId" value={selectedPlayer.favoriteTeamId} onChange={handleEditChange} />
          </label>
          <label>
            권한: <input name="role" value={selectedPlayer.role} onChange={handleEditChange} />
          </label>
          <div className="edit-form-buttons">
            <button className="save-btn" onClick={handleSave}>저장</button>
            <button className="delete-btn" onClick={handleDelete}>삭제</button>
          </div>
        </div>
      )}
      {/* 선수 목록 테이블 */}
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
          {paginatedPlayers.map(player => (
            <tr key={player.playerId} onDoubleClick={() => setSelectedPlayer(player)}>
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
