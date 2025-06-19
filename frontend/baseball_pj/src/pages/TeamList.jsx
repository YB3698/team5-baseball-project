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

  // team_id가 1~10번인 팀만 필터링
  const filteredTeams = selectedTeamName
    ? teams.filter(team => team.teamName === selectedTeamName && team.teamId >= 1 && team.teamId <= 10)
    : teams.filter(team => team.teamId >= 1 && team.teamId <= 10);

  return (
    <div className="team-list-container">
      <h2>팀 목록</h2>

      <table className="team-table">
        <thead>
          <tr>
            <th>로고</th>
            <th>팀명</th>
            <th>마스코트</th>
            <th>홈구장</th>
            <th>등록일</th>
          </tr>
        </thead>
        <tbody>
          {filteredTeams.map(team => (
            <tr key={team.teamId}>
              <td>
                {team.teamLogo ? (
                  <img src={team.teamLogo} alt={team.teamName} style={{ width: 50, height: 50, objectFit: 'contain' }}/>
                ) : ('이미지 없음')}
              </td>
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
