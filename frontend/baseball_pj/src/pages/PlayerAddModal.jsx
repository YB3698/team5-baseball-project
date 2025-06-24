import React, { useState } from 'react';
import './PlayerAddModal.css';

const PlayerAddModal = ({ isOpen, onClose, onSave }) => {
  // 초기값 함수
  const initPlayer = () => ({
    playerName: '',
    playerPosition: '',
    playerBackNumber: '',
    playerBirthDate: '',
    playerHeightWeight: '',
    playerEducationPath: '',
    teamId: ''
  });

  const [newPlayer, setNewPlayer] = useState(initPlayer());

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPlayer(prev => ({ ...prev, [name]: value }));
  };

  // 저장 처리
  const handleSave = () => {
    const payload = {
      ...newPlayer,
      playerBackNumber: newPlayer.playerBackNumber ? Number(newPlayer.playerBackNumber) : null,
      teamId: newPlayer.teamId ? Number(newPlayer.teamId) : null,
      playerBirthDate: newPlayer.playerBirth || null
    };

    fetch('/api/admin/players', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.text();
      })
      .then(text => {
        try {
          const data = JSON.parse(text || '{}');
          if (data && data.playerId) {
            onSave(data); // 부모 컴포넌트에 성공 데이터 전달
            alert('선수가 성공적으로 추가되었습니다.');
            handleClose();
          } else {
            alert('선수 추가에 실패했습니다. 서버 응답을 확인해주세요.');
          }
        } catch (e) {
          alert('추가 응답 파싱 오류: ' + e);
        }
      })
      .catch(err => alert('추가 실패: ' + err));
  };

  // 모달 닫기 및 초기화
  const handleClose = () => {
    setNewPlayer(initPlayer());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h3>선수 등록</h3>
        <div className="form-grid">
          <label>이름<input name="playerName" value={newPlayer.playerName} onChange={handleChange} /></label>
          <label>포지션<input name="playerPosition" value={newPlayer.playerPosition} onChange={handleChange} /></label>
          <label>등번호<input name="playerBackNumber" type="number" value={newPlayer.playerBackNumber} onChange={handleChange} /></label>
          <label>생년월일<input name="playerBirthDate" type="date" value={newPlayer.playerBirthDate} onChange={handleChange} /></label>
          <label>키/몸무게<input name="playerHeightWeight" value={newPlayer.playerHeightWeight} onChange={handleChange} /></label>
          <label>학력<input name="playerEducationPath" value={newPlayer.playerEducationPath} onChange={handleChange} /></label>
          <label>팀 ID<input name="teamId" type="number" value={newPlayer.teamId} onChange={handleChange} /></label>
        </div>
        <div className="form-buttons">
          <button className="save-btn" onClick={handleSave}>추가</button>
          <button className="cancel-btn" onClick={handleClose}>닫기</button>
        </div>
      </div>
    </div>
  );
};

export default PlayerAddModal;