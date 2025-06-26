import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
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
import PostDetail from './pages/PostDetail'; // PostDetail 컴포넌트 임포트

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

function AppRoutes() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const authPaths = ['/login', '/signup', '/register'];

  useEffect(() => {
    const checkLoginStatus = () => {
      const user = localStorage.getItem('user');
      setIsLoggedIn(!!user);
    };
    checkLoginStatus();
    const handleStorageChange = () => { checkLoginStatus(); };
    window.addEventListener('storage', handleStorageChange);
    const handleFocus = () => { checkLoginStatus(); };
    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  useEffect(() => {
    // 로그인 상태에서 오직 /login에 있을 때만 홈으로 이동
    if (isLoggedIn && location.pathname === '/login') {
      navigate('/', { replace: true });
    }
  }, [isLoggedIn, location.pathname, navigate]);

  return (
    <>
      <Header setIsLoggedIn={setIsLoggedIn} />
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
        <Route path="/posts/:postId" element={<PostDetail />} /> {/* 게시글 상세 페이지 라우트 추가 */}
        <Route path="/board/:postId" element={<PostList />} />
        <Route path="/polladmin" element={<PollAdmin />} />
        <Route path="/management" element={<Management />} /> 
        <Route path="/mypage" element={<ProtectedRoute><MyPage /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
