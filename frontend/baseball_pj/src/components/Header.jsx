// Header.jsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBaseballBall } from 'react-icons/fa';
import './Header.css';

const Header = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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

  return (
    <div className="header-wrapper">
      <div className="top-bar">
        {user ? (
          <>
            <span>👋 {user.nickname} 님</span>
            <button onClick={handleLogout} className="logout-btn">로그아웃</button>
          </>
        ) : (
          <>
            <Link to="/login" className="top-link">로그인</Link>
            <Link to="/signup" className="top-link">회원가입</Link>
          </>
        )}
      </div>

      <header className="header">
        <div className="header-container">
          <div className="logo-wrap">
            <FaBaseballBall className="baseball-icon" />
            <h1 className="logo-text">
              <Link to="/" className="logo-link">
                Baseball <span style={{ fontWeight: '300' }}>커뮤니티</span>
              </Link>
            </h1>
          </div>

          <nav className="nav-menu">
            <Link to="/matchschedule" className="nav-link">경기일정 및 결과</Link>
            <Link to="/playerlist" className="nav-link">선수정보</Link>
            <Link to="/teamlist" className="nav-link">팀정보</Link>
            <Link to="/playerstats" className="nav-link">기록실</Link>
            <Link to="/mypage" className="menu-link">마이페이지</Link> 
          </nav>
        </div>
      </header>
    </div>
  );
};

export default Header;
