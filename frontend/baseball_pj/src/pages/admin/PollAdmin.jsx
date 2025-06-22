import { useState, useEffect } from 'react';
import axios from 'axios';
import './PollAdmin.css';

export default function PollAdmin() {
  const [pollTitle, setPollTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [polls, setPolls] = useState([]);
  const [selectedPollId, setSelectedPollId] = useState(null);
  const [optionDesc, setOptionDesc] = useState('');
  const [options, setOptions] = useState([]);
  const [openedPollId, setOpenedPollId] = useState(null); // 추가: 열린 투표 항목 상태


  // 옵션 수정 상태 관리
  const [editOptionId, setEditOptionId] = useState(null);
  const [editOptionDesc, setEditOptionDesc] = useState('');

  // 투표 항목(제목/기간) 수정 상태 관리
  const [editPollId, setEditPollId] = useState(null);
  const [editPollTitle, setEditPollTitle] = useState('');
  const [editStartDate, setEditStartDate] = useState('');
  const [editEndDate, setEditEndDate] = useState('');

  // ✅ 전체 투표 항목 조회
  useEffect(() => {
    axios.get('/api/admin/polls').then(res => setPolls(res.data));
  }, []);

  // ✅ 선택지 조회
  const fetchOptions = (pollId) => {
    axios.get(`/api/admin/polls/${pollId}/options`)
      .then(res => setOptions(res.data));
  };

  // ✅ 투표 항목 등록
  const handleCreatePoll = () => {
    axios.post('/api/admin/polls', {
      pollTitle,
      startDate,
      endDate,
      isActive: 'Y'
    }).then(() => window.location.reload());
  };

  // ✅ 선택지 등록
  const handleAddOption = () => {
    const poll = polls.find(p => String(p.pollId) === String(selectedPollId));
    if (poll && poll.isActive === 'N') {
      alert('이미 종료된 항목입니다.');
      return;
    }
    axios.post(`/api/admin/polls/${selectedPollId}/options`, {
      description: optionDesc
    }).then(() => {
      setOptionDesc('');
      fetchOptions(selectedPollId);
    });
  };

  // ✅ 투표 종료(비활성화)
 const handleEndPoll = (pollId) => {
  axios.put(`/api/admin/polls/${pollId}/status`, null, {
    params: { isActive: 'N' }
  })
  .then(() => {
    alert('투표가 종료되었습니다.');
    window.location.reload();
  })
  .catch((err) => {
    console.error('❌ 종료 실패:', err);
    alert('종료에 실패했습니다.');
  });
};

// 옵션 삭제
  const handleDeleteOption = (optionId) => {
    const poll = polls.find(p => String(p.pollId) === String(selectedPollId));
    if (poll && poll.isActive === 'N') {
      alert('이미 종료된 항목입니다.');
      return;
    }
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    axios.delete(`/api/admin/polls/${selectedPollId}/options/${optionId}`)
      .then(() => fetchOptions(selectedPollId));
  };

  // 옵션 수정 시작
  const handleEditOption = (optionId, description) => {
    const poll = polls.find(p => String(p.pollId) === String(selectedPollId));
    if (poll && poll.isActive === 'N') {
      alert('이미 종료된 항목입니다.');
      return;
    }
    setEditOptionId(optionId);
    setEditOptionDesc(description);
  };

  // 옵션 수정 저장
  const handleSaveEditOption = (optionId) => {
    axios.put(`/api/admin/polls/${selectedPollId}/options/${optionId}`, {
      description: editOptionDesc
    }).then(() => {
      setEditOptionId(null);
      setEditOptionDesc('');
      fetchOptions(selectedPollId);
    });
  };

  // 옵션 수정 취소
  const handleCancelEditOption = () => {
    setEditOptionId(null);
    setEditOptionDesc('');
  };

  // 투표 항목 수정 시작
  const handleEditPoll = (poll) => {
    if (poll.isActive === 'N') {
      alert('이미 종료된 항목입니다.');
      return;
    }
    setEditPollId(poll.pollId);
    setEditPollTitle(poll.pollTitle);
    setEditStartDate(poll.startDate);
    setEditEndDate(poll.endDate);
  };

  // 투표 항목 수정 저장
  const handleSaveEditPoll = (pollId) => {
    axios.put(`/api/admin/polls/${pollId}`, {
      pollTitle: editPollTitle,
      startDate: editStartDate,
      endDate: editEndDate
    }).then(() => {
      setEditPollId(null);
      setEditPollTitle('');
      setEditStartDate('');
      setEditEndDate('');
      window.location.reload();
    });
  };

  // 투표 항목 수정 취소
  const handleCancelEditPoll = () => {
    setEditPollId(null);
    setEditPollTitle('');
    setEditStartDate('');
    setEditEndDate('');
  };

  // 투표 항목 삭제
  const handleDeletePoll = (pollId, isActive) => {
    if (isActive === 'Y') {
      alert('아직 진행중인 투표입니다.');
      return;
    }
    if (!window.confirm('정말 이 투표 항목을 삭제하시겠습니까?')) return;
    axios.delete(`/api/admin/polls/${pollId}`)
      .then(() => window.location.reload());
  };

  return (
    <div className="polladmin-root">
      <h2 className="polladmin-title">🗳️ 관리자 투표 등록</h2>
      <input className="polladmin-input" placeholder="투표 제목" value={pollTitle} onChange={e => setPollTitle(e.target.value)} />
      <input className="polladmin-input" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
      <input className="polladmin-input" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
      <button className="polladmin-btn" onClick={handleCreatePoll}>투표 항목 등록</button>

      <hr />

      <h3 className="polladmin-section-title">📋 등록된 항목 목록</h3>
      <ul className="polladmin-list">
        {polls.map(p => (
          <li key={p.pollId}>
            {editPollId === p.pollId ? (
              <>
                <input className="polladmin-input" value={editPollTitle} onChange={e => setEditPollTitle(e.target.value)} />
                <input className="polladmin-input" type="date" value={editStartDate} onChange={e => setEditStartDate(e.target.value)} />
                <input className="polladmin-input" type="date" value={editEndDate} onChange={e => setEditEndDate(e.target.value)} />
                <button className="polladmin-btn" onClick={() => handleSaveEditPoll(p.pollId)}>저장</button>
                <button className="polladmin-btn" onClick={handleCancelEditPoll}>취소</button>
              </>
            ) : (
              <>
                <button className="polladmin-poll-btn" onClick={() => {
                  if (openedPollId === p.pollId) {
                    setOpenedPollId(null);
                    setSelectedPollId(null);
                    setOptions([]);
                  } else {
                    setOpenedPollId(p.pollId);
                    setSelectedPollId(p.pollId);
                    fetchOptions(p.pollId);
                  }
                }}>
                  {p.pollTitle} ({p.startDate} ~ {p.endDate})
                </button>
                <button className="polladmin-btn" onClick={() => handleEditPoll(p)}>수정</button>
                <button className="polladmin-end-btn" onClick={() => handleDeletePoll(p.pollId, p.isActive)}>삭제</button>
              </>
            )}
            {p.isActive === 'Y' && (
              <button className="polladmin-end-btn" onClick={() => handleEndPoll(p.pollId)}>
                투표 종료
              </button>
            )}
            {/* 펼쳐진 항목만 선택지 추가/목록 노출 */}
            {openedPollId === p.pollId && (
              <div>
                <h4 className="polladmin-section-title">➕ 선택지 추가</h4>
                <input className="polladmin-option-input" placeholder="선택지 설명" value={optionDesc} onChange={e => setOptionDesc(e.target.value)} />
                <button className="polladmin-btn" onClick={handleAddOption}>추가</button>
                <ul className="polladmin-option-list">
                  {options.map(o => (
                    <li key={o.optionId}>
                      {editOptionId === o.optionId ? (
                        <>
                          <input
                            className="polladmin-option-input"
                            value={editOptionDesc}
                            onChange={e => setEditOptionDesc(e.target.value)}
                          />
                          <button className="polladmin-btn" onClick={() => handleSaveEditOption(o.optionId)}>저장</button>
                          <button className="polladmin-btn" onClick={handleCancelEditOption}>취소</button>
                        </>
                      ) : (
                        <>
                          <span>{o.description}</span>
                          <button className="polladmin-btn" onClick={() => handleEditOption(o.optionId, o.description)}>수정</button>
                          <button className="polladmin-end-btn" onClick={() => handleDeleteOption(o.optionId)}>삭제</button>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}