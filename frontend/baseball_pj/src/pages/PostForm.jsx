// PostForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Board.css';

const dummyUser = { nickname: '홍길동' };
const dummyTeams = [
  { id: 1, name: '두산 베어스' },
  { id: 2, name: 'LG 트윈스' },
];

const PostForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [teamId, setTeamId] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('게시글 제출:', { title, content, teamId });
    setSubmitted(true);
  };

  const selectedTeamName = dummyTeams.find((team) => team.id.toString() === teamId)?.name;

  return (
    <div className="page-container">
      <h2>게시글 작성</h2>
      <div className="post-box" style={{ maxWidth: '900px', margin: '0 auto', padding: '40px' }}>
        {!submitted ? (
          <form onSubmit={handleSubmit} className="post-form">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label>제목</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label>내용</label>
                <textarea
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label>관련 팀</label>
                <select
                  value={teamId}
                  onChange={(e) => setTeamId(e.target.value)}
                  required
                  style={{ width: '100%' }}
                >
                  <option value="">-- 선택 --</option>
                  {dummyTeams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="actions" style={{ justifyContent: 'flex-end' }}>
                <button type="submit">작성 완료</button>
              </div>
            </div>
          </form>
        ) : (
          <div className="submitted-view">
            <h3>{title}</h3>
            <p className="submitted-content">{content}</p>
            <p className="meta">
              작성자: {dummyUser.nickname} | 관련 팀: {selectedTeamName}
            </p>
            <div className="actions">
              <button onClick={() => navigate('/postlist')}>목록으로</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostForm;
