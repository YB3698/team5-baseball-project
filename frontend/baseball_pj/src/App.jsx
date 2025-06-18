import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MyPage from './pages/MyPage';
import Home from './pages/Home';

function App() {
  // 로컬스토리지에 'user'가 존재하면 로그인된 상태로 판단
  const isLoggedIn = !!localStorage.getItem('user');

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* ✅ 마이페이지는 로그인 상태일 때만 접근 가능, 아니면 로그인 페이지로 이동 */}
        <Route
          path="/mypage"
          element={isLoggedIn ? <MyPage /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
