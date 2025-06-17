import { useState } from 'react';
import axios from 'axios';

const kboTeams = [
  { id: 1, name: '두산 베어스' },
  { id: 2, name: '삼성 라이온즈' },
  { id: 3, name: 'SSG 랜더스' },
  { id: 4, name: 'LG 트윈스' },
  { id: 5, name: 'NC 다이노스' },
  { id: 6, name: '키움 히어로즈' },
  { id: 7, name: '한화 이글스' },
  { id: 8, name: 'KIA 타이거즈' },
  { id: 9, name: '롯데 자이언츠' },
  { id: 10, name: 'KT 위즈' },
];

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [favoriteTeamId, setFavoriteTeamId] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = {
        email,
        password,
        nickname,
        favoriteTeamId: Number(favoriteTeamId),
        role: "user" // 서버에서 기본값 있지만 명시해도 좋음
      };

      const res = await axios.post('/api/users/join', user);

      alert('✅ 회원가입 성공!');
      console.log(res.data);
    } catch (err) {
      console.error('❌ 회원가입 실패:', err.response);
      alert('회원가입 실패: ' + (err.response?.data || err.message));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      /><br />

      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      /><br />

      <input
        type="text"
        placeholder="닉네임"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        required
      /><br />

      <select
        value={favoriteTeamId}
        onChange={(e) => setFavoriteTeamId(e.target.value)}
        required
      >
        <option value="">응원팀 선택</option>
        {kboTeams.map((team) => (
          <option key={team.id} value={team.id}>
            {team.name}
          </option>
        ))}
      </select><br />

      <button type="submit">가입하기</button>
    </form>
  );
};

export default Signup;
