import { useEffect, useState } from 'react';
import axios from 'axios';
import './TeamList.css';

const TeamList = () => {
  const [teams, setTeams] = useState([]);
  const [selectedTeamName, setSelectedTeamName] = useState(''); // 선택한 팀명

  useEffect(() => {
    console.log('api 요청 시작...')
    axios.get('/api/teams')
      .then(res => setTeams(res.data))
      .catch(err => console.error('팀 정보 로딩 실패:', err));
  }, []);

  const filteredTeams = selectedTeamName
    ? teams.filter(team => team.teamName === selectedTeamName)
    : teams;

  return (
    <div className="team-list-container">
      <h2>팀 목록</h2>

      <div className="filter-box">
        <label htmlFor="teamSelect">팀 선택:</label>
        <select
          id="teamSelect"
          value={selectedTeamName}
          onChange={(e) => setSelectedTeamName(e.target.value)}
        >
          <option value="">전체 보기</option>
          {teams.map(team => (
            <option key={team.teamId} value={team.teamName}>
              {team.teamName}
            </option>
          ))}
        </select>
      </div>

      <div className="team-count">검색 결과: {filteredTeams.length}개</div>

      <table className="team-table">
        <thead>
          <tr>
            <th>팀명</th>
            <th>마스코트</th>
            <th>홈구장</th>
            <th>등록일</th>
          </tr>
        </thead>
        <tbody>
          {filteredTeams.map(team => (
            <tr key={team.teamId}>
              <td>{team.teamName}</td>
              <td>{team.teamMascot}</td>
              <td>{team.teamStadium}</td>
              <td>{team.teamCreatedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeamList;
