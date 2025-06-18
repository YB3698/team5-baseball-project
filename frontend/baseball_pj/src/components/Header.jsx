// React의 useEffect, useState 훅을 import
import { useEffect, useState } from 'react'; // 컴포넌트 상태 및 생명주기 관리
// 라우팅을 위한 Link, useNavigate import
import { Link, useNavigate } from 'react-router-dom'; // 페이지 이동 및 링크 생성
// 야구공 아이콘 import
import { FaBaseballBall } from 'react-icons/fa'; // 아이콘 사용
// 헤더 스타일 import
import './Header.css'; // CSS 스타일 적용

// 상단 고정 헤더 컴포넌트 정의
const Header = () => {
  // 로그인한 사용자 정보를 저장하는 상태 (초기값: null)
  const [user, setUser] = useState(null);
  // 페이지 이동을 위한 navigate 함수 생성
  const navigate = useNavigate();

  // 컴포넌트가 처음 마운트될 때 localStorage에서 user 정보 불러오기
  useEffect(() => {
    const storedUser = localStorage.getItem('user'); // localStorage에서 'user' 키로 저장된 값 가져오기
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // user 정보가 있으면 상태에 저장 (문자열 → 객체 변환)
    }
  }, []); // 최초 1회만 실행

  // 로그아웃 버튼 클릭 시 실행되는 함수
  const handleLogout = () => {
    localStorage.removeItem('user'); // localStorage에서 'user' 정보 삭제
    setUser(null); // 상태 초기화 (로그아웃 처리)
    navigate('/login'); // 로그인 페이지로 이동
  };

  // 헤더 UI 렌더링
  return (
    <header className="header"> {/* 상단 고정 헤더 전체 영역 */}
      <div className="header-container"> {/* 중앙 정렬 컨테이너 */}
        <div className="logo-wrap"> {/* 로고 및 타이틀 영역 */}
          <FaBaseballBall className="baseball-icon" /> {/* 야구공 아이콘 표시 */}
          <h1 className="logo-text">
            <Link to="/" className="logo-link"> {/* 홈으로 이동하는 로고 텍스트 */}
              Baseball <span style={{fontWeight:'300'}}>커뮤니티</span>
            </Link>
          </h1>
        </div>
        <nav className="menu-wrap"> {/* 우측 메뉴 영역 */}
          {user ? (
            // 로그인 상태일 때 보여줄 메뉴
            <>
              <span className="nickname">👋 {user.nickname} 님</span> {/* 사용자 닉네임 표시 */}
              <button onClick={handleLogout} className="logout-btn">로그아웃</button> {/* 로그아웃 버튼 */}
              <Link to="/mypage" className="menu-link">마이페이지</Link> {/* 마이페이지 이동 링크 */}
            </>
          ) : (
            // 비로그인 상태일 때 보여줄 메뉴
            <>
              <Link to="/login" className="menu-link">로그인</Link> {/* 로그인 페이지 이동 */}
              <Link to="/signup" className="menu-link">회원가입</Link> {/* 회원가입 페이지 이동 */}
              <Link to="/playerlist" className="menu-link">선수정보</Link> {/* 선수정보 페이지 이동 */}
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

// Header 컴포넌트 export (다른 파일에서 사용 가능하게 내보내기)
export default Header;
