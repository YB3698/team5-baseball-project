import { useEffect, useState } from 'react';
import axios from 'axios';
import { fetchTodayRanks } from '../api/rankApi';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar
} from 'recharts';
import './Home.css';

function Home() {
  const [ranks, setRanks] = useState([]);

  // 투표 상태
  const [polls, setPolls] = useState([]); // 전체 투표 항목
  const [selectedPollId, setSelectedPollId] = useState('');
  const [options, setOptions] = useState([]);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [results, setResults] = useState([]);
  const [endedPoll, setEndedPoll] = useState(null); // 종료된 투표 항목
  const [teamDist, setTeamDist] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.userId;

  // 📊 순위 시각화
  useEffect(() => {
    fetchTodayRanks()
      .then(setRanks)
      .catch(err => console.error('❌ 순위 데이터 실패:', err));
  }, []);

  // 🗳️ 전체 투표 항목
  useEffect(() => {
    axios.get('/api/admin/polls')
      .then(res => {
        setPolls(res.data); // isActive 필터 제거해 전체 가져옴
      })
      .catch(err => console.error('❌ 투표 항목 실패:', err));
  }, []);

  // 팀 분포 데이터 가져오기
  useEffect(() => {
    axios.get('/api/users/team-distribution')
      .then(res => setTeamDist(res.data))
      .catch(err => console.error('❌ 팀 분포 실패:', err));
  }, []);

  // 선택지 가져오기
  const fetchOptions = (pollId) => {
    axios.get(`/api/admin/polls/${pollId}/options`)
      .then(res => setOptions(res.data))
      .catch(err => console.error('❌ 옵션 실패:', err));
  };

  // 투표하기
  const handleVote = () => {
    if (!userId) return alert('로그인 필요');
    if (!selectedPollId || !selectedOptionId) return alert('선택 후 투표');
    const poll = polls.find(p => String(p.pollId) === String(selectedPollId));
    if (poll && poll.isActive === 'N') {
      alert('이미 종료된 투표입니다. 결과를 확인해주세요.');
      return;
    }
    axios.post('/api/votes', {
      userId,
      pollId: selectedPollId,
      optionId: selectedOptionId
    })
    .then(() => {
      alert('투표 완료');
      handleResultView(selectedPollId);
    })
    .catch(err => {
      console.error('❌ 투표 실패:', err);
      alert('투표는 한 번만 가능합니다. 결과보기를 눌러주세요.');
    });
  };

  // 결과 보기
  const handleResultView = (pollId) => {
  axios.get(`/api/votes/${pollId}/results`)
    .then(res => {
      console.log('투표 결과 응답:', res.data); // 추가
      const processed = res.data.map(r => ({
        ...r,
        voteCount: Number(r.voteCount)
      })).sort((a, b) => b.voteCount - a.voteCount);
      setResults(processed);
      const poll = polls.find(p => p.pollId === Number(pollId));
      setEndedPoll(poll);
    })
    .catch(err => console.error('❌ 결과 실패:', err));
};

  // 팀명별 색상 매핑
  const teamColorMap = {
    '두산 베어스': '#0f255e',    // 남청색
    'LG 트윈스': '#a50034',     // 자주색
    '삼성 라이온즈': '#005bac', // 파랑색
    '한화 이글스': '#ff7c1c',   // 주황색
    '롯데 자이언츠': '#ff9999', // 흰색
    'KT 위즈': '#111111',      // 검정색
    'KIA 타이거즈': '#d6002f',  // 빨간색
    'SSG 랜더스': '#ffe600',   // 노랑색
    'NC 다이노스': '#20c3b3',  // 민트색
    '키움 히어로즈': '#6e2639' // 버건디
  };

  return (
    <div className="home-root">
      <h1 className="home-title">📊 피타고리안 순위 vs 실제 순위</h1>

      {/* 4분할 레이아웃 */}
      <div className="home-grid-2x2">
        {/* 1. 순위 차트 */}
        <div className="home-chart-box">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={ranks}>
              <XAxis dataKey="teamName" />
              <YAxis reversed={true} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="realRank" name="실제 순위" stroke="#8884d8" strokeWidth={2} />
              <Line type="monotone" dataKey="pythRank" name="피타고리안 순위" stroke="#82ca9d" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* 2. 투표 박스 */}
        <div className="home-vote-box">
          <h2 className="vote-title">🗳️ 투표하기</h2>
          <select
            className="vote-select"
            value={selectedPollId}
            onChange={(e) => {
              const pollId = e.target.value;
              setSelectedPollId(pollId);
              fetchOptions(pollId);
              setResults([]);
              setSelectedOptionId(null);
            }}
          >
            <option value="">-- 투표 항목 선택 --</option>
            {polls.map(p => (
              <option key={p.pollId} value={p.pollId}>
                {p.pollTitle} {p.isActive === 'N' && '(종료됨)'}
              </option>
            ))}
          </select>
          <ul className="vote-options">
            {options.map(o => (
              <li key={o.optionId}>
                <label className="vote-option-label">
                  <input
                    type="radio"
                    name="voteOption"
                    value={o.optionId}
                    checked={selectedOptionId === o.optionId}
                    onChange={() => setSelectedOptionId(o.optionId)}
                  />
                  <span>{o.description}</span>
                </label>
              </li>
            ))}
          </ul>
          <div className="vote-btn-row">
            <button onClick={handleVote} disabled={!selectedOptionId} className="vote-btn">투표하기</button>
            <button onClick={() => handleResultView(selectedPollId)} className="result-btn">결과보기</button>
          </div>
        </div>
        {/* 3. 유저 팀 분포 */}
        <div className="home-chart-box">
          <h3 style={{ marginBottom: 8 }}>유저 팀 분포</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={teamDist}>
              <XAxis dataKey="teamName" tick={false} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="userCount" name="유저 수">
                {teamDist.map((entry, idx) => (
                  <Cell key={entry.teamName} fill={teamColorMap[entry.teamName] || '#8884d8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* 4. 투표 결과 */}
        <div className="home-chart-box">
          {results.length > 0 && (
            <div className="vote-result-box">
              <h4 className="vote-result-title">📈 투표 결과 ({endedPoll?.pollTitle})</h4>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={results}
                    dataKey="voteCount"
                    nameKey="description"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                  >
                    {results.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={["#8884d8", "#ffc658", "#ff7f7f", "#82ca9d"][index % 4]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name, props) => [`${value}표`, props.payload.description]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
