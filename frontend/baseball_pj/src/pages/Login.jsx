import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

// 공통 로그아웃 함수 (다른 컴포넌트에서도 재사용 가능)
export const handleLogout = () => {
  localStorage.removeItem('user');
  window.location.href = '/login';
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('/api/users/login', { email, password });
      alert('✅ 로그인 성공');
      console.log(res.data);

      localStorage.setItem('user', JSON.stringify(res.data));
      
      // 이전 페이지로 돌아가거나 홈으로 이동
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err) {
      alert('❌ 로그인 실패: ' + (err.response?.data || err.message));
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">로그인</h2>
      <form onSubmit={handleLogin} style={{ width: '100%' }}>
        <label className="login-label">이메일</label>
        <input
          type="email"
          className="login-input"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="login-label">비밀번호</label>
        <input
          type="password"
          className="login-input"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="login-btn">
          로그인
        </button>

        <div style={{ marginTop: '23px', textAlign: 'right' }}>
          <a
            href="/signup"
            style={{
              fontSize: '0.95rem',
              color: '#2c74d8',
              textDecoration: 'underline',
              marginRight: '10px',
            }}
          >
            회원가입
          </a>
        </div>
      </form>
    </div>
  );
};

export default Login;
