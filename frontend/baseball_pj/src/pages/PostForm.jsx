import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Board.css';
import axios from 'axios';

const dummyTeams = [
  { id: 1, name: 'NC 다이노스' },
  { id: 2, name: '롯데 자이언츠' },
  { id: 3, name: '삼성 라이온즈' },
  { id: 4, name: 'KIA 타이거즈' },
  { id: 5, name: 'LG 트윈스' },
  { id: 6, name: '두산 베어스' },
  { id: 7, name: 'KT 위즈' },
  { id: 8, name: 'SSG 랜더스' },
  { id: 9, name: '한화 이글스' },
  { id: 10, name: '키움 히어로즈' },
];

const PostForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [teamId, setTeamId] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  // 사용자 정보 가져오기
  let user = null;
  let userId = null;
  try {
    user = JSON.parse(localStorage.getItem('user'));
    userId = user?.userId || user?.user_id;
  } catch (e) {
    user = null;
    userId = null;
  }

  const isLoggedIn = !!userId;
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert('로그인 후에 게시글 작성이 가능합니다.');
      navigate('/login');
      return;
    }

    // 제목 유효성 검사
    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    // 내용 유효성 검사
    if (!content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    // 팀 선택 유효성 검사
    if (!teamId) {
      alert('관련 팀을 선택해주세요.');
      return;
    }

    try {
      await axios.post('/api/posts', {
        userId,
        teamId,
        postTitle: title,
        postContent: content
      }); 

      setSubmitted(true);
    } catch (err) {
      alert('글 저장에 실패했습니다.');
      console.error(err);
    }
  };

  return (
    <div className="post-form page-container wider-form">
      <h2>게시글 작성</h2>
      {!isLoggedIn ? (
        <div className="not-logged-in">
          <p>로그인 후에 게시글을 작성할 수 있습니다.</p>
          <button onClick={() => navigate('/login')}>로그인 하러 가기</button>
        </div>
      ) : !submitted ? (
        <form onSubmit={handleSubmit}>          <label>제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="게시글 제목을 입력해주세요"
            required
          />

          <label>내용</label>
          <textarea
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="게시글 내용을 입력해주세요"
            required
          ></textarea>

          <label>관련 팀</label>
          <select value={teamId} onChange={(e) => setTeamId(Number(e.target.value))} required>
            <option value="">-- 팀을 선택해주세요 --</option>
            {dummyTeams
              .filter(team => team.id >= 1 && team.id <= 10) // 1~10번 팀만 필터링
              .map((team) => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
          </select>
          <div className="form-btns">
  <button type="button" className="back-btn" onClick={() => navigate(-1)}>뒤로 가기</button>
  <button type="submit" className="submit-btn">작성 완료</button>
</div>
        </form>
      ) : (
        <div className="submitted-view">
          <h3>{title}</h3>
          <p className="submitted-content">{content}</p>
          <p className="meta">
            작성자: {user?.nickname} | 관련 팀: {dummyTeams.find(t => t.id === Number(teamId))?.name}
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
