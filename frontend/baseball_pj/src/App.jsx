import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MyPage from './pages/Mypage';
import Home from './pages/Home';
import PlayerList from './pages/PlayerList';
import TeamList from './pages/TeamList';
import MatchSchedule from './pages/MatchSchedule';
import PlayerStats from './pages/PlayerStats';
import PostForm from './pages/PostForm';
import PostList from './pages/PostList';
import PollAdmin from './pages/admin/PollAdmin';
import Management from './pages/Management';

// 보호된 라우트 컴포넌트
const ProtectedRoute = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem('user');
      setIsLoggedIn(!!user);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 컴포넌트 마운트 시와 로그인 상태 변경 감지
  useEffect(() => {
    const checkLoginStatus = () => {
      const user = localStorage.getItem('user');
      setIsLoggedIn(!!user);
    };

    // 초기 로그인 상태 확인
    checkLoginStatus();

    // localStorage 변경 감지 (다른 탭에서 로그인/로그아웃 시)
    const handleStorageChange = () => {
      checkLoginStatus();
    };

    window.addEventListener('storage', handleStorageChange);

    // 페이지 포커스 시 로그인 상태 재확인 (뒤로가기 등)
    const handleFocus = () => {
      checkLoginStatus();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/playerlist" element={<PlayerList />} />
        <Route path="/teamList" element={<TeamList />} />
        <Route path="/matchschedule" element={<MatchSchedule />} />
        <Route path="/playerstats" element={<PlayerStats />} />
        <Route path="/postform" element={<PostForm />} />
        <Route path="/postlist" element={<PostList />} />
        <Route path="/polladmin" element={<PollAdmin />} />
        <Route path="/management" element={<Management />} /> 
        
        {/* ✅ 마이페이지는 로그인 상태일 때만 접근 가능 */}
        <Route
          path="/mypage"
          element={
            <ProtectedRoute>
              <MyPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
