// Header.jsx
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { FaBaseballBall } from 'react-icons/fa';
import mainlogoImg from './img/main_logo_blue.png'; // 로고 이미지 경로
import './Header.css';

const Header = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const handleHomeClick = () => {
    navigate('/', { replace: true });
  };

  const handleScheduleClick = () => {
    navigate('/matchschedule', { replace: true });
  };

  const handlePlayerClick = () => {
    navigate('/playerlist', { replace: true });
  };

  const handleTeamClick = () => {
    navigate('/teamlist', { replace: true });
  };

  const handleStatsClick = () => {
    navigate('/playerstats', { replace: true });
  };

  const handleBoardClick = () => {
    navigate('/postlist', { replace: true });
    // 페이지 새로고침으로 상태 완전 초기화
    setTimeout(() => {
      window.location.reload();
    }, 10);
  };

  return (
    <div className="header-wrapper">
      <div className="top-bar">
        {user ? (
          <>
            <span>👋 {user.nickname} 님</span>
            <button onClick={handleLogout} className="logout-btn">로그아웃</button>
            {user.role === "admin" ? (
              <Link to="/management">관리자페이지</Link>
            ) : (
              <Link to="/mypage">마이페이지</Link>
            )}
          </>
        ) : (
          <>
            <Link to="/login">로그인</Link>
          </>
        )}
      </div>      <header className="header">
        <div className="header-container">
          <div className="logo-wrap">
          
            <h1 className="logo-text">
              <Link to="/" className="logo-link">
                 <span style={{ fontWeight: '700' }}><img src={mainlogoImg} alt="로고"  /></span>
              </Link>
            </h1>
          </div>
          <nav className="nav-menu">
            <button onClick={handleHomeClick} className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>홈</button>
            <button onClick={handleScheduleClick} className={`nav-link ${location.pathname === '/matchschedule' ? 'active' : ''}`}>경기일정 및 결과</button>
            <button onClick={handlePlayerClick} className={`nav-link ${location.pathname === '/playerlist' ? 'active' : ''}`}>선수정보</button>
            <button onClick={handleTeamClick} className={`nav-link ${location.pathname === '/teamlist' ? 'active' : ''}`}>팀정보</button>
            <button onClick={handleStatsClick} className={`nav-link ${location.pathname === '/playerstats' ? 'active' : ''}`}>기록실</button>
            <button onClick={handleBoardClick} className={`nav-link board-button ${location.pathname === '/postlist' ? 'active' : ''}`}>게시판</button>
          </nav>
          <div className="header-spacer"></div>
        </div>
      </header>
    </div>
  );
};

export default Header;