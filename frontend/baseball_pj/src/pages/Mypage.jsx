import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Mypage.css';

// 최신 팀 정보 기반 배열
const kboTeams = [
  { id: 1, name: 'NC 다이노스' },
  { id: 2, name: '롯데 자이언츠' },
  { id: 3, name: '삼성 라이온스' },
  { id: 4, name: 'KIA 타이거즈' },
  { id: 5, name: 'LG 트윈스' },
  { id: 6, name: '두산 베어스' },
  { id: 7, name: 'KT 위즈' },
  { id: 8, name: 'SSG 랜더스' },
  { id: 9, name: '한화 이글스' },
  { id: 10, name: '키움 히어로즈' },
];

const MyPage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate('/login'); // 로그인 안 되어있으면 리디렉션
    }
  }, [navigate]);

  if (!user) return null;

  const teamName = kboTeams.find((team) => team.id === user.teamId)?.name || '정보 없음';

  return (
    <div className="mypage-container">
      <h2 className="mypage-title">마이페이지</h2>
      <div className="mypage-row">
        <label className="mypage-label">닉네임</label>
        <div className="mypage-info">{user.nickname}</div>
      </div>
      <div className="mypage-row">
        <label className="mypage-label">이메일</label>
        <div className="mypage-info">{user.email}</div>
      </div>
      <div className="mypage-row">
        <label className="mypage-label">응원 팀</label>
        <div className="mypage-info">{teamName}</div>
      </div>
      <button
        className="mypage-btn"
        onClick={() => {
          localStorage.removeItem('user');
          window.location.reload();
        }}
      >
        로그아웃
      </button>
    </div>
  );
};

export default MyPage;
