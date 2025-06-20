import React, { useEffect, useState } from 'react';
import './PlayerStats.css';
import axios from 'axios';

const PlayerStats = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [type, setType] = useState('hitter');
  const [players, setPlayers] = useState([]);

  const fetchData = async () => {
    try {
      const res = await axios.get(`/api/stats?year=${year}&type=${type}`);
      console.log('받은 데이터:', type, res.data); // 데이터 타입 확인용
      setPlayers(res.data);
    } catch (err) {
      console.error('데이터 불러오기 실패:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [type, year]);

  const handleSearch = () => {
    fetchData();
  };

  return (
    <div className="player-stats-container">
      <h2>선수 기록</h2>
      <div className="filter-bar">
        <select value={year} onChange={(e) => setYear(e.target.value)}>
          {Array.from({ length: 30 }, (_, i) => 2001 + i).map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="hitter">타자</option>
          <option value="pitcher">투수</option>
        </select>
        <button onClick={handleSearch}>검색</button>
      </div>

      {type === 'hitter' ? (
        <table className="stats-table">
          <thead>
            <tr>
              <th>순위</th><th>선수명</th><th>팀명</th><th>AVG</th><th>G</th><th>PA</th><th>AB</th>
              <th>R</th><th>H</th><th>2B</th><th>3B</th><th>HR</th><th>TB</th><th>RBI</th><th>SAC</th><th>SF</th>
            </tr>
          </thead>
          <tbody>
            {players.map((p, idx) => (
              <tr key={p.playerId || idx}>
                <td>{idx + 1}</td><td>{p.playerName}</td><td>{p.teamId}</td>
                <td>{p.avg}</td><td>{p.gamesPlayed}</td><td>{p.plateAppearances}</td><td>{p.atBats}</td>
                <td>{p.runs}</td><td>{p.hits}</td><td>{p.doubles}</td><td>{p.triples}</td>
                <td>{p.homeRuns}</td><td>{p.totalBases}</td><td>{p.runsBattedIn}</td><td>{p.sacrificeHits}</td><td>{p.sacrificeFlies}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <table className="stats-table">
          <thead>
            <tr>
              <th>순위</th><th>선수명</th><th>팀명</th><th>ERA</th><th>G</th><th>W</th><th>L</th>
              <th>SV</th><th>IP</th><th>H</th><th>HR</th><th>BB</th><th>SO</th>
            </tr>
          </thead>
          <tbody>
            {players.map((p, idx) => (
              <tr key={p.id || idx}>
                <td>{idx + 1}</td>
                <td>{p.playerName}</td>
                <td>{p.teamId}</td>
                <td>{p.era}</td>
                <td>{p.gamesPlayed}</td>
                <td>{p.wins}</td>
                <td>{p.losses}</td>
                <td>{p.saves}</td>
                <td>{p.inningsPitched}</td>
                <td>{p.hitsAllowed}</td>
                <td>{p.homeRunsAllowed}</td>
                <td>{p.walksAllowed}</td>
                <td>{p.strikeouts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PlayerStats;