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

  return (
    <div className="post-form page-container wider-form">
      <h2>게시글 작성</h2>
      {!submitted ? (
        <form onSubmit={handleSubmit}>
          <label>제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label>내용</label>
          <textarea
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>

          <label>관련 팀</label>
          <select value={teamId} onChange={(e) => setTeamId(e.target.value)} required>
            <option value="">-- 선택 --</option>
            {dummyTeams.map((team) => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </select>

          <button type="submit">작성 완료</button>
        </form>
      ) : (
        <div className="submitted-view">
          <h3>{title}</h3>
          <p className="submitted-content">{content}</p>
          <p className="meta">
            작성자: {dummyUser.nickname} | 관련 팀: {dummyTeams.find(t => t.id.toString() === teamId)?.name}
          </p>
          <div className="actions align-right">
            <button onClick={() => navigate('/postlist')}>목록으로</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostForm;