import React, { useState, useEffect } from 'react';
import './VoteManagement.css';

const dummyVotes = [
  {
    id: 1,
    question: '올해의 MVP는 누구?',
    options: ['선수A', '선수B', '선수C'],
    totalVotes: 120,
    createdAt: '2025-06-01',
  },
  {
    id: 2,
    question: '가장 멋진 홈런 세리머니는?',
    options: ['선수D', '선수E'],
    totalVotes: 85,
    createdAt: '2025-06-15',
  },
];

const VoteManagement = () => {
  const [votes, setVotes] = useState([]);
  const [selectedVote, setSelectedVote] = useState(null);

  useEffect(() => {
    // 실제 API로 바꿔 연결 가능
    setVotes(dummyVotes);
  }, []);

  const handleEdit = (vote) => setSelectedVote(vote);
  const handleDelete = (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      setVotes(votes.filter((v) => v.id !== id));
      setSelectedVote(null);
    }
  };

  const handleSave = () => {
    alert('저장되었습니다 (더미)');
    setSelectedVote(null);
  };

  return (
    <div className="vote-management-container">
      <h2 className="vote-title">투표 관리</h2>

      {selectedVote && (
        <div className="vote-edit-form">
          <h3>투표 수정</h3>
          <label>
            질문:
            <input
              type="text"
              value={selectedVote.question}
              onChange={(e) =>
                setSelectedVote({ ...selectedVote, question: e.target.value })
              }
            />
          </label>
          <label>
            선택지 (쉼표로 구분):
            <input
              type="text"
              value={selectedVote.options.join(', ')}
              onChange={(e) =>
                setSelectedVote({
                  ...selectedVote,
                  options: e.target.value.split(',').map((opt) => opt.trim()),
                })
              }
            />
          </label>
          <div className="vote-buttons">
            <button className="save-btn" onClick={handleSave}>저장</button>
            <button className="delete-btn" onClick={() => handleDelete(selectedVote.id)}>삭제</button>
          </div>
        </div>
      )}

      <table className="vote-table">
        <thead>
          <tr>
            <th>질문</th>
            <th>선택지</th>
            <th>총 투표 수</th>
            <th>생성일</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {votes.map((vote) => (
            <tr key={vote.id}>
              <td>{vote.question}</td>
              <td>{vote.options.join(', ')}</td>
              <td>{vote.totalVotes}</td>
              <td>{vote.createdAt}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(vote)}>수정</button>
                <button className="delete-btn" onClick={() => handleDelete(vote.id)}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VoteManagement;
