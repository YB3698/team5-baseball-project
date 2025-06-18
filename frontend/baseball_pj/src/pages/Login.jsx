// React의 useState 훅 import (상태 관리)
import { useState } from 'react';
// axios 라이브러리 import (HTTP 통신)
import axios from 'axios';
// 로그인 페이지 전용 CSS import
import './Login.css';

// Login 컴포넌트 정의
const Login = () => {
  // 이메일, 비밀번호 입력값을 관리하는 상태 선언
  const [email, setEmail] = useState(''); // 이메일 입력값
  const [password, setPassword] = useState(''); // 비밀번호 입력값

  // 로그인 폼 제출 시 실행되는 함수 (비동기)
  const handleLogin = async (e) => {
    e.preventDefault(); // 폼 기본 제출 동작(새로고침) 방지

    try {
      // 서버에 로그인 요청 (POST: email, password 전달)
      const res = await axios.post('/api/users/login', { email, password });
      alert('✅ 로그인 성공'); // 성공 알림
      console.log(res.data); // 로그인한 유저 정보 콘솔 출력

      // 로그인 상태를 localStorage에 저장 (새로고침/이동에도 유지)
      localStorage.setItem('user', JSON.stringify(res.data));
      window.location.href = '/'; // 홈으로 이동 및 새로고침
    } catch (err) {
      // 로그인 실패 시 에러 메시지 출력
      alert('❌ 로그인 실패: ' + (err.response?.data || err.message));
    }
  };

  // 로그인 폼 UI 렌더링
  return (
    <div className="login-container"> {/* 로그인 전체 컨테이너 */}
      <h2 className="login-title">로그인</h2> {/* 타이틀 */}
      <form onSubmit={handleLogin} style={{ width: '100%' }}> {/* 폼 제출 시 handleLogin 실행 */}
        <label className="login-label">이메일</label> {/* 이메일 라벨 */}
        <input
          type="email"
          className="login-input"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // 입력값 변경 시 상태 업데이트
          required
        />
        <label className="login-label">비밀번호</label> {/* 비밀번호 라벨 */}
        <input
          type="password"
          className="login-input"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // 입력값 변경 시 상태 업데이트
          required
        />
        <button type="submit" className="login-btn">
          로그인
        </button>
      </form>
    </div>
  );
};

// Login 컴포넌트 export (다른 파일에서 사용 가능하게 내보내기)
export default Login;
