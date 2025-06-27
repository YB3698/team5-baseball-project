import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import axios from 'axios';
import { fetchTodayRanks } from '../api/rankApi';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar
} from 'recharts';
import './Home.css';
import homeImg from './img/home_img.png';
import bot from './img/bot.png';
import ChatBot from './ChatBot';
import Talk from './Talk';

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
  const [showChat, setShowChat] = useState(false); // 챗봇 채팅창 상태
  const [botPos, setBotPos] = useState({ x: window.innerWidth - 210, y: window.innerHeight - 120 });
  const [dragging, setDragging] = useState(false);

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

  // 선택지 가져오기 - 메모이제이션 적용
  const fetchOptions = useCallback((pollId) => {
    if (!pollId) return;
    axios.get(`/api/admin/polls/${pollId}/options`)
      .then(res => setOptions(res.data))
      .catch(err => console.error('❌ 옵션 실패:', err));
  }, []);

  // 투표하기 - 메모이제이션 적용
  const handleVote = useCallback(() => {
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
  }, [userId, selectedPollId, selectedOptionId, polls]);

  // 결과 보기 - 메모이제이션 적용
  const handleResultView = useCallback((pollId) => {
    if (!pollId) return;
    axios.get(`/api/votes/${pollId}/results`)
      .then(res => {
        console.log('투표 결과 응답:', res.data);
        const processed = res.data.map(r => ({
          ...r,
          voteCount: Number(r.voteCount)
        })).sort((a, b) => b.voteCount - a.voteCount);
        setResults(processed);
        const poll = polls.find(p => p.pollId === Number(pollId));
        setEndedPoll(poll);
      })
      .catch(err => console.error('❌ 결과 실패:', err));
  }, [polls]);

  // 팀명별 색상 매핑 - 메모이제이션 적용
  const teamColorMap = useMemo(() => ({
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
  }), []);

  // 봇 드래그 핸들러 - 성능 최적화된 버전
  const handleBotMouseDown = (e) => {
    // 왼쪽 버튼만 동작
    if (e.button !== 0) return;
    
    const startX = e.clientX; 
    const startY = e.clientY;
    const startBotX = botPos.x;
    const startBotY = botPos.y;
    let hasMoved = false;
    let animationId = null;
    
    // 쓰로틀링을 위한 RAF 기반 업데이트
    const updatePosition = (deltaX, deltaY) => {
      if (animationId) return; // 이미 업데이트 예약됨
      
      animationId = requestAnimationFrame(() => {
        setBotPos({
          x: startBotX + deltaX,
          y: startBotY + deltaY
        });
        animationId = null;
      });
    };
    
    // 마우스 이동 핸들러
    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      
      // 5px 이상 움직였을 때만 드래그로 인식
      if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
        if (!hasMoved) {
          hasMoved = true;
          document.body.style.userSelect = 'none';
          setDragging(true);
        }
        
        updatePosition(deltaX, deltaY);
      }
    };
    
    // 마우스 업 핸들러
    const handleMouseUp = () => {
      // 정리 작업
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      
      document.body.style.userSelect = '';
      setDragging(false);
      
      // 드래그하지 않았을 때만 채팅창 토글
      if (!hasMoved) {
        setShowChat(v => !v);
      }
    };
    
    // 이벤트 리스너 추가
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  return (
    <>
      <div className="home-root">
        {/* 왼쪽 고정 실시간 채팅 */}
        <div style={{ position: 'fixed', left: 20, top: 125, zIndex: 1000 }}>
          <Talk />
        </div>

        {/* 4분할 레이아웃 */}
        <div className="home-grid-2x2">        {/* 1. 순위 차트 */}
          <div className="home-chart-box">
            <div className="pythagorean-header" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3>📊 피타고리안 순위 vs 실제 순위</h3>
              <div
                className="pyth-tooltip-icon"
                style={{ cursor: 'pointer', position: 'relative', display: 'inline-block' }}
                tabIndex={0}
              >
                <span
                  style={{
                    display: 'inline-block',
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: '#eee',
                    color: '#333',
                    textAlign: 'center',
                    lineHeight: '20px',
                    fontWeight: 'bold',
                    fontSize: 14,
                    border: '1px solid #ccc',
                    marginLeft: 4
                  }}
                >?</span>
                <div className="pyth-tooltip-text" style={{
                  display: 'none',
                  position: 'absolute',
                  top: 28,
                  left: 0,
                  zIndex: 10,
                  background: '#fff',
                  border: '1px solid #ccc',
                  borderRadius: 6,
                  padding: '10px 14px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  width: 260,
                  fontSize: 14,
                  color: '#222',
                  fontWeight: 400
                }}>
                  피타고리안 승률은 팀의 득점과 실점을 바탕으로 이론적으로 기대되는 승률을 계산한 값입니다.<br/>
                  <b>공식:</b> (득점²) / (득점² + 실점²)<br/>
                  실제 순위와 비교해 팀의 운이나 경기력의 효율성을 평가할 수 있습니다.
                </div>
              </div>
            </div>
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
          </div>        {/* 2. 투표 박스 */}
          <div className="home-vote-box">
            <div className="vote-content">
              <div className="vote-left">
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
              </div>            <div className="vote-right">
                <div className="vote-image-container">
                  <img 
                    src={homeImg} 
                    alt="투표 이미지" 
                    className="vote-image"
                  />
                  <div className="vote-image-text">
                    
                  </div>
                </div>
              </div>
            </div>
          </div>{/* 3. 유저 팀 분포 */}
          <div className="home-chart-box">
            <h3>👥 유저 팀 분포</h3>
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
          </div>        {/* 4. 투표 결과 */}
          <div className="home-chart-box">
            <div className="vote-result-box">
              <h4 className="vote-result-title">
                📈 투표 결과
                {endedPoll?.pollTitle && ` (${endedPoll.pollTitle})`}
              </h4>
              {results.length > 0 ? (
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
              ) : (
                <div className="no-vote-result">
                  <p>투표를 진행하면 결과가 표시됩니다.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* 오른쪽 하단 봇 버튼 (드래그 가능) */}
      <button
        className="bot-fab"
        onMouseDown={handleBotMouseDown}
        style={{
          position: 'absolute',
          left: botPos.x,
          top: botPos.y, 
          cursor: dragging ? 'grabbing' : 'grab', // 드래그 중일 때 커서 변경
          zIndex: 1000 // 헤더보다 위로
        }}
      >
        <img src={bot} alt="Bot" />
      </button>
      {showChat && (
        <div className="bot-chat-popup" style={{
          position: 'absolute',
          left: botPos.x - 130,
          top: botPos.y - 450
        }}>
          <div className="bot-chat-header">HEYJ_Bot <button className="bot-chat-close" onClick={() => setShowChat(false)}>×</button></div>
          <div className="bot-chat-body">
            <ChatBot />
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
