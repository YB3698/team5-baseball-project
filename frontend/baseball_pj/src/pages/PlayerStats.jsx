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
      setPlayers(res.data);
    } catch (err) {
      console.error('데이터 불러오기 실패:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
              <tr key={idx}>
                <td>{idx + 1}</td><td>{p.PLAYER_NAME}</td><td>{p.TEAM_NAME}</td>
                <td>{p.HITTER_STATS_AVG}</td><td>{p.HITTER_STATS_G}</td><td>{p.HITTER_STATS_PA}</td><td>{p.HITTER_STATS_AB}</td>
                <td>{p.HITTER_STATS_R}</td><td>{p.HITTER_STATS_H}</td><td>{p.HITTER_STATS_2B}</td><td>{p.HITTER_STATS_3B}</td>
                <td>{p.HITTER_STATS_HR}</td><td>{p.HITTER_STATS_TB}</td><td>{p.HITTER_STATS_RBI}</td><td>{p.HITTER_STATS_SAC}</td><td>{p.HITTER_STATS_SF}</td>
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
              <tr key={idx}>
                <td>{idx + 1}</td><td>{p.PLAYER_NAME}</td><td>{p.TEAM_NAME}</td>
                <td>{p.PITCHER_STATS_ERA}</td><td>{p.PITCHER_STATS_G}</td><td>{p.PITCHER_STATS_W}</td><td>{p.PITCHER_STATS_L}</td>
                <td>{p.PITCHER_STATS_SV}</td><td>{p.PITCHER_STATS_IP}</td><td>{p.PITCHER_STATS_H}</td>
                <td>{p.PITCHER_STATS_HR}</td><td>{p.PITCHER_STATS_BB}</td><td>{p.PITCHER_STATS_SO}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PlayerStats;
