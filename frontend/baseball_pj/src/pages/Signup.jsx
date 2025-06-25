// React의 useState, useEffect 훅 import (상태 및 생명주기 관리)
import { useState, useEffect } from 'react';
// axios 라이브러리 import (HTTP 통신)
import axios from 'axios';
// 회원가입 페이지 전용 CSS import
import './Signup.css';

// KBO 리그 팀 목록 상수 (id, name)
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

// 입력값 변경 시 일정 시간 후에만 값이 반영되도록 하는 커스텀 훅 (디바운스)
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value); // 디바운스된 값 상태
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay); // delay 후 값 반영
    return () => clearTimeout(handler); // 언마운트/변경 시 타이머 해제
  }, [value, delay]);
  return debouncedValue; // 최종적으로 디바운스된 값 반환
}

// Signup 컴포넌트 정의
const Signup = () => {
  // 입력값 상태 관리
  const [email, setEmail] = useState(''); // 이메일 입력값
  const [password, setPassword] = useState(''); // 비밀번호 입력값
  const [passwordCheck, setPasswordCheck] = useState(''); // 비밀번호 확인 입력값
  const [nickname, setNickname] = useState(''); // 닉네임 입력값
  const [favoriteTeamId, setFavoriteTeamId] = useState(''); // 선택한 팀 id

  // 이메일/닉네임 중복 검증 결과 및 메시지 상태
  const [emailValid, setEmailValid] = useState(null); // 이메일 사용 가능 여부
  const [nicknameValid, setNicknameValid] = useState(null); // 닉네임 사용 가능 여부
  const [emailMsg, setEmailMsg] = useState(''); // 이메일 검증 메시지
  const [nicknameMsg, setNicknameMsg] = useState(''); // 닉네임 검증 메시지

  // 입력값이 변경될 때마다 1초 후에만 실제 검증 요청 (디바운스 적용)
  const debouncedEmail = useDebounce(email, 1000);
  const debouncedNickname = useDebounce(nickname, 1000);

  // 이메일 중복 체크 (debouncedEmail이 바뀔 때마다 실행)
  useEffect(() => {
    // 이메일 형식이 아닐 경우 중복검증 하지 않음
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!debouncedEmail || !emailPattern.test(debouncedEmail)) {
      setEmailValid(null);
      setEmailMsg('');
      return;
    }
    (async () => {
      try {
        // 서버에 이메일 중복 체크 요청
        const res = await axios.get(`/api/users/check-email?email=${debouncedEmail}`);
        if (res.data) {
          setEmailValid(true); // 사용 가능
          setEmailMsg('✅ 사용 가능한 이메일입니다.');
        } else {
          setEmailValid(false); // 중복
          setEmailMsg('❌ 이미 사용 중인 이메일입니다.');
        }
      } catch {
        setEmailValid(false);
        setEmailMsg('❌ 이메일 확인 중 오류 발생');
      }
    })();
  }, [debouncedEmail]);

  // 닉네임 중복 체크 (debouncedNickname이 바뀔 때마다 실행)
  useEffect(() => {
    if (!debouncedNickname) {
      setNicknameValid(null);
      setNicknameMsg('');
      return;
    }
    (async () => {
      try {
        // 서버에 닉네임 중복 체크 요청
        const res = await axios.get(`/api/users/check-nickname?nickname=${debouncedNickname}`);
        if (res.data) {
          setNicknameValid(true); // 사용 가능
          setNicknameMsg('✅ 사용 가능한 닉네임입니다.');
        } else {
          setNicknameValid(false); // 중복
          setNicknameMsg('❌ 이미 사용 중인 닉네임입니다.');
        }
      } catch {
        setNicknameValid(false);
        setNicknameMsg('❌ 닉네임 확인 중 오류 발생');
      }
    })();
  }, [debouncedNickname]);

  // 회원가입 폼 제출 시 실행되는 함수
  const handleSubmit = async (e) => {
    e.preventDefault(); // 폼 기본 제출 동작 방지

    // 비밀번호와 비밀번호 확인이 다르면 회원가입 불가
    if (password !== passwordCheck) {
      alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    // 중복 검증 미통과 시 회원가입 불가
    if (emailValid === false || nicknameValid === false) {
      alert('❌ 중복된 이메일 또는 닉네임이 존재합니다.');
      return;
    }

    try {
      // 회원가입 요청에 사용할 유저 정보 객체 생성
      const user = {
        email,
        password,
        nickname,
        favoriteTeamId: Number(favoriteTeamId), // 문자열 → 숫자 변환
        role: 'user'
      };

      // 서버에 회원가입 요청 (POST)
      const res = await axios.post('/api/users/join', user);
      alert('✅ 회원가입 성공!'); // 성공 알림
      console.log(res.data); // 서버 응답 콘솔 출력
      window.location.href = '/'; // 홈으로 이동 및 새로고침

      // 입력값 및 상태 초기화
      setEmail('');
      setPassword('');
      setPasswordCheck('');
      setNickname('');
      setFavoriteTeamId('');
      setEmailValid(null);
      setNicknameValid(null);
      setEmailMsg('');
      setNicknameMsg('');
    } catch (err) {
      // 회원가입 실패 시 에러 메시지 출력
      console.error('❌ 회원가입 실패:', err.response);
      alert('회원가입 실패: ' + (err.response?.data || err.message));
    }
  };

  // 회원가입 폼 UI 렌더링
  return (
    <div className="signup-container"> {/* 전체 컨테이너 */}
      <h2 className="signup-title">회원가입</h2> {/* 타이틀 */}
      <form onSubmit={handleSubmit}> {/* 폼 제출 시 handleSubmit 실행 */}
        <label className="signup-label">아이디(email)</label> {/* 이메일 라벨 */}
        <div className="signup-input-row">
          <input
            type="email"
            className="signup-input"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // 입력값 변경 시 상태 업데이트
            required
          />
        </div>
        {/* 이메일 중복/오류 메시지 */}
        {emailMsg && (
          <div className={emailValid === false ? 'signup-error' : 'signup-success'}>{emailMsg}</div>
        )}

        <label className="signup-label">비밀번호</label> {/* 비밀번호 라벨 */}
        <input
          type="password"
          className="signup-input"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // 입력값 변경 시 상태 업데이트
          required
        />
        <label className="signup-label">비밀번호 확인</label>
        <input
          type="password"
          className="signup-input"
          placeholder="비밀번호 확인"
          value={passwordCheck}
          onChange={(e) => setPasswordCheck(e.target.value)}
          required
        />
        {/* 비밀번호 일치 안내 메시지 */}
        {passwordCheck && (
          <div className={password === passwordCheck ? 'signup-success' : 'signup-error'}>
            {password === passwordCheck ? '✅ 비밀번호가 일치합니다.' : '❌ 비밀번호가 일치하지 않습니다.'}
          </div>
        )}

        <label className="signup-label">닉네임</label> {/* 닉네임 라벨 */}
        <div className="signup-input-row">
          <input
            type="text"
            className="signup-input"
            placeholder="닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)} // 입력값 변경 시 상태 업데이트
            required
          />
        </div>
        {/* 닉네임 중복/오류 메시지 */}
        {nicknameMsg && (
          <div className={nicknameValid === false ? 'signup-error' : 'signup-success'}>{nicknameMsg}</div>
        )}

        <label className="signup-label">응원팀</label> {/* 응원팀 라벨 */}
        <select
          className="signup-input"
          value={favoriteTeamId}
          onChange={(e) => setFavoriteTeamId(e.target.value)} // 선택값 변경 시 상태 업데이트
          required
        >
          <option value="">응원팀 선택</option>
          {kboTeams.map((team) => (
            <option key={team.id} value={team.id}>{team.name}</option>
          ))}
        </select>
        <div className="notice-text">※ 가입 후 응원팀은 한 번만 변경 가능합니다.</div>

        <button
          type="submit"
          className="signup-btn"
          disabled={
            emailValid === false ||
            nicknameValid === false ||
            !email ||
            !password ||
            !nickname ||
            !favoriteTeamId ||
            password !== passwordCheck
          }
        >
          회원가입
        </button>
      </form>
    </div>
  );
};

// Signup 컴포넌트 export (다른 파일에서 사용 가능하게 내보내기)
export default Signup;
