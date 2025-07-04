import React, { useEffect, useState } from 'react';
import './PlayerStats.css';
import axios from 'axios';

const PlayerStats = () => {
  const currentYear = new Date().getFullYear();

  const [searchYear, setSearchYear] = useState(currentYear);
  const [searchType, setSearchType] = useState('hitter');

  const [players, setPlayers] = useState([]);
  const [lastQueryYear, setLastQueryYear] = useState(currentYear);
  const [lastQueryType, setLastQueryType] = useState('hitter');

  // 첫 로딩
  useEffect(() => {
    fetchData(currentYear, 'hitter');
  }, []);

  const fetchData = async (year, type) => {
    try {
      const res = await axios.get(`/api/stats?year=${year}&type=${type}`);
      setPlayers(res.data);
      setLastQueryYear(year);
      setLastQueryType(type);
    } catch (err) {
      console.error('데이터 불러오기 실패:', err);
    }
  };

  const handleSearch = () => {
    fetchData(searchYear, searchType);
  };

  return (
    <div className="playerstats-container">
      <h2 className="playerstats-title">선수 기록</h2>

      <div className="playerstats-controls">
        <select value={searchYear} onChange={(e) => setSearchYear(Number(e.target.value))}>
          {Array.from({ length: 30 }, (_, i) => 2002 + i).map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
          <option value="hitter">타자</option>
          <option value="pitcher">투수</option>
        </select>
        <button onClick={handleSearch}>검색</button>
      </div>

      <div className="playerstats-card">
        {lastQueryType === 'hitter' ? (
          <table className="playerstats-table">
            <thead>
              <tr>
                <th>순위</th><th>선수명</th><th>팀명</th><th>AVG</th><th>G</th><th>PA</th><th>AB</th>
                <th>R</th><th>H</th><th>2B</th><th>3B</th><th>HR</th><th>TB</th><th>RBI</th><th>SAC</th><th>SF</th>
              </tr>
            </thead>
            <tbody>
              {players.map((p, idx) => (
                <tr key={p.playerId || idx}>
                  <td>{idx + 1}</td><td>{p.playerName}</td><td>{p.teamName}</td>
                  <td>{p.avg}</td><td>{p.gamesPlayed}</td><td>{p.plateAppearances}</td><td>{p.atBats}</td>
                  <td>{p.runs}</td><td>{p.hits}</td><td>{p.doubles}</td><td>{p.triples}</td>
                  <td>{p.homeRuns}</td><td>{p.totalBases}</td><td>{p.runsBattedIn}</td><td>{p.sacrificeHits}</td><td>{p.sacrificeFlies}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="playerstats-table">
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
                  <td>{p.teamName}</td>
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
    </div>
  );
};

export default PlayerStats;
