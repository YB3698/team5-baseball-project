import { useEffect, useState } from 'react';
import { fetchTodayRanks } from '../api/rankApi';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

function Home() {
  // 랭킹 데이터를 저장할 상태 변수
  const [ranks, setRanks] = useState([]);

  useEffect(() => {
    // 컴포넌트 마운트 시 오늘의 랭킹 데이터를 비동기로 불러옴
    fetchTodayRanks()
      .then(setRanks)
      .catch((err) => console.error('❌ 랭킹 데이터 불러오기 실패:', err));
  }, []); // 최초 1회 실행

  return (
    <div className="p-4">
      {/* 차트 제목 */}
      <h1 className="text-2xl font-bold mb-6">피타고리안 순위 vs 실제 순위 (Line Chart)</h1>
      {/* 반응형 컨테이너로 차트 크기 자동 조정 */}
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={ranks}>
          {/* X축: 팀 이름, Y축: 순위(작은 값이 위로 오도록 reversed) */}
          <XAxis dataKey="teamName" />
          <YAxis reversed={true} />
          <Tooltip /> {/* 마우스 오버 시 정보 표시 */}
          <Legend /> {/* 범례 */}
          {/* 실제 순위 라인 */}
          <Line type="monotone" dataKey="realRank" name="실제 순위" stroke="#8884d8" strokeWidth={2} />
          {/* 피타고리안 순위 라인 */}
          <Line type="monotone" dataKey="pythRank" name="피타고리안 순위" stroke="#82ca9d" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Home;
