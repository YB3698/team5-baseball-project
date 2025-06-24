import React, { useEffect, useState } from 'react';
import PlayerAddModal from './PlayerAddModal';
import './PlayerManagement.css';

// 선수 관리 페이지 컴포넌트
const PlayerManagement = () => {
  const [players, setPlayers] = useState([]); // 선수 목록 상태
  const [selectedPlayer, setSelectedPlayer] = useState(null); // 선택된 선수 상태
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // 추가 모달 상태
  const [filters, setFilters] = useState(initFilters()); // 필터 상태
  const [currentPage, setCurrentPage] = useState(1); // 페이지 상태
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetch('/api/admin/players')
      .then(res => res.text())
      .then(text => {
        const data = JSON.parse(text || '[]');
        setPlayers(Array.isArray(data) ? data : []);
      })
      .catch(() => setPlayers([]));
  }, []);

  function initFilters() {
    return {
      playerId: '',
      playerName: '',
      playerPosition: '',
      playerBackNumber: '',
      playerBirthDate: '',
      playerHeightWeight: '',
      playerEducationPath: '',
      teamId: ''
    };
  }

  const resetForm = () => {
    setSelectedPlayer(null);
  };

  const clearFilters = () => {
    setFilters(initFilters());
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedPlayer(prev => ({ ...prev, [name]: value }));
  };

  const handlePlayerAdded = (newPlayerData) => {
    setPlayers(prev => [...prev, newPlayerData]);
  };

  const handleSave = () => {
    if (!selectedPlayer) return;

    const payload = {
      ...selectedPlayer,
      playerBackNumber: selectedPlayer.playerBackNumber ? Number(selectedPlayer.playerBackNumber) : null,
      teamId: selectedPlayer.teamId ? Number(selectedPlayer.teamId) : null,
      playerBirthDate: selectedPlayer.playerBirthDate || null
    };

    fetch(`/api/admin/players/${selectedPlayer.playerId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.text();
      })
      .then(text => {
        try {
          const data = JSON.parse(text || '{}');
          if (data && data.playerId) {
            setPlayers(prev => prev.map(p => p.playerId === data.playerId ? data : p));
            alert('선수 정보가 성공적으로 수정되었습니다.');
            resetForm();
          } else {
            alert('선수 수정에 실패했습니다. 서버 응답을 확인해주세요.');
          }
        } catch (e) {
          alert('수정 응답 파싱 오류: ' + e);
        }
      })
      .catch(err => alert('수정 실패: ' + err));
  };

  const handleDelete = () => {
    if (!selectedPlayer) return;
    if (!window.confirm(`정말로 ${selectedPlayer.playerName} 선수를 삭제하시겠습니까?`)) return;

    fetch(`/api/admin/players/${selectedPlayer.playerId}`, { method: 'DELETE' })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        setPlayers(prev => prev.filter(p => p.playerId !== selectedPlayer.playerId));
        alert('선수가 성공적으로 삭제되었습니다.');
        resetForm();
      })
      .catch(err => alert('삭제 실패: ' + err));
  };

  const filteredPlayers = players.filter(p => {
    return (
      String(p.playerId || '').includes(filters.playerId) &&
      (p.playerName || '').includes(filters.playerName) &&
      (p.playerPosition || '').includes(filters.playerPosition) &&
      String(p.playerBackNumber || '').includes(filters.playerBackNumber) &&
      String(p.playerBirthDate || '').includes(filters.playerBirthDate) &&
      (p.playerHeightWeight || '').includes(filters.playerHeightWeight) &&
      (p.playerEducationPath || '').includes(filters.playerEducationPath) &&
      String(p.teamId || '').includes(filters.teamId)
    );
  });

  const totalPages = Math.ceil(filteredPlayers.length / ITEMS_PER_PAGE) || 1;
  const paginatedPlayers = filteredPlayers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getPageNumbers = () => {
    const visibleCount = 5;
    let start = Math.max(1, currentPage - Math.floor(visibleCount / 2));
    let end = start + visibleCount - 1;
    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - visibleCount + 1);
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div className="player-management-container">
      <h2 className="player-management-title">선수 관리</h2>
      <div className="action-buttons">
        <div className="stats-info">
          총 선수 수: {players.length} | 필터된 선수 수: {filteredPlayers.length}
        </div>
        <button className="add-btn" onClick={() => setIsAddModalOpen(true)}>선수 등록</button>
      </div>

      <div className="filter-section">
        <input name="playerId" placeholder="선수 ID" value={filters.playerId} onChange={handleFilterChange} />
        <input name="playerName" placeholder="선수 이름" value={filters.playerName} onChange={handleFilterChange} />
        <input name="playerPosition" placeholder="포지션" value={filters.playerPosition} onChange={handleFilterChange} />
        <input name="playerBackNumber" placeholder="등번호" value={filters.playerBackNumber} onChange={handleFilterChange} />
        <input name="teamId" placeholder="팀 ID" value={filters.teamId} onChange={handleFilterChange} />
        <button className="clear-filter-btn" onClick={clearFilters}>❌</button>
      </div>

      <PlayerAddModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handlePlayerAdded}
      />

      {selectedPlayer && (
        <div className="player-edit-form">
          <h4>선수 수정 - {selectedPlayer.playerName}</h4>
          <div className="form-grid">
            <label>이름<input name="playerName" value={selectedPlayer.playerName || ''} onChange={handleEditChange} /></label>
            <label>포지션<input name="playerPosition" value={selectedPlayer.playerPosition || ''} onChange={handleEditChange} /></label>
            <label>등번호<input name="playerBackNumber" type="number" value={selectedPlayer.playerBackNumber || ''} onChange={handleEditChange} /></label>
            <label>생년월일<input name="playerBirthDate" type="date" value={selectedPlayer.playerBirthDate || ''} onChange={handleEditChange} /></label>
            <label>키/몸무게<input name="playerHeightWeight" value={selectedPlayer.playerHeightWeight || ''} onChange={handleEditChange} /></label>
            <label>학력<input name="playerEducationPath" value={selectedPlayer.playerEducationPath || ''} onChange={handleEditChange} /></label>
            <label>팀 ID<input name="teamId" type="number" value={selectedPlayer.teamId || ''} onChange={handleEditChange} /></label>
          </div>
          <div className="form-buttons">
            <button className="save-btn" onClick={handleSave}>저장</button>
            <button className="delete-btn" onClick={handleDelete}>삭제</button>
            <button className="cancel-btn" onClick={resetForm}>취소</button>
          </div>
        </div>
      )}

      <table className="player-management-table">
        <thead>
          <tr>
            <th>ID</th><th>이름</th><th>포지션</th><th>등번호</th><th>생년월일</th>
            <th>키/몸무게</th><th>학력</th><th>팀 ID</th>
          </tr>
        </thead>
        <tbody>
          {paginatedPlayers.length > 0 ? (
            paginatedPlayers.map(player => (
              <tr key={player.playerId} onDoubleClick={() => setSelectedPlayer(player)}>
                <td>{player.playerId}</td><td>{player.playerName}</td><td>{player.playerPosition}</td>
                <td>{player.playerBackNumber}</td><td>{player.playerBirthDate}</td>
                <td>{player.playerHeightWeight}</td><td>{player.playerEducationPath}</td>
                <td>{player.teamId}</td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="8" className="no-data">선수 데이터가 없습니다.</td></tr>
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>«</button>
          <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>‹</button>
          {getPageNumbers().map(num => (
            <button key={num} onClick={() => setCurrentPage(num)} className={num === currentPage ? 'active' : ''}>{num}</button>
          ))}
          <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>›</button>
          <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>»</button>
        </div>
      )}
    </div>
  );
};

export default PlayerManagement;
