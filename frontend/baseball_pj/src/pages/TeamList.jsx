// TeamList.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import './TeamList.css';

const TeamList = () => {
  const [teams, setTeams] = useState([]);
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    axios.get('/api/teams')
      .then(res => setTeams(res.data))
      .catch(err => console.error('팀 불러오기 실패:', err));
  }, []);

  const filtered = teams.filter(team =>
    team.team_name.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <div className="teamlist-container">
      <h2 className="teamlist-title">팀 목록</h2>
      <div className="teamlist-search-box">
        <input
          type="text"
          value={keyword}
          placeholder="팀명 검색"
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button className="teamlist-btn">검색</button>
      </div>
      <div className="teamlist-count">검색 결과: {filtered.length}건</div>

      {filtered.length > 0 ? (
        <table className="teamlist-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>팀 이름</th>
              <th>마스코트</th>
              <th>홈구장</th>
              <th>설립연도</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((team) => (
              <tr key={team.team_id}>
                <td>{team.team_id}</td>
                <td>{team.team_name}</td>
                <td>{team.team_mascot}</td>
                <td>{team.team_stadium}</td>
                <td>{new Date(team.team_created_at).getFullYear()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="teamlist-empty">팀 정보가 없습니다.</div>
      )}
    </div>
  );
};

export default TeamList;
