import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from "recharts";
import "./Home.css";

// 실시간 투표현황 그래프 컴포넌트
function VoteGraph() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 투표 현황 데이터 백엔드에서 가져오기
    axios.get("/api/votes/summary")
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError("데이터를 불러올 수 없습니다.");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="vote-graph-container">로딩 중...</div>;
  if (error) return <div className="vote-graph-container">{error}</div>;

  return (
    <div className="vote-graph-container">
      <div className="vote-graph-title">실시간 투표 현황</div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="playerName" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="voteCount" fill="#1976d2" name="득표수" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default VoteGraph;
