import { useEffect, useState } from 'react';
import axios from 'axios';
import './TeamList.css';

const TeamList = () => {
  const [teams, setTeams] = useState([]);
  const [selectedTeamName, setSelectedTeamName] = useState('');

  useEffect(() => {
  axios.get('/api/teams')
    .then(res => {
      // 한글 팀명 오름차순 정렬
      const sortedTeams = res.data.sort((a, b) => a.teamName.localeCompare(b.teamName, 'ko'));
      setTeams(sortedTeams);
    })
    .catch(err => console.error('팀 정보 로딩 실패:', err));
}, []);


  const filteredTeams = selectedTeamName
    ? teams.filter(team => team.teamName === selectedTeamName && team.teamId >= 1 && team.teamId <= 10)
    : teams.filter(team => team.teamId >= 1 && team.teamId <= 10);

  return (
    <div className="team-page-container">
      {/* ❌ 카드 아님: 제목은 배경 위에 */}
      <h2 className="team-title">팀 목록</h2>

      {/* ✅ 이 아래부터 카드 박스 시작 */}
      <div className="team-card-box">
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
                    <img src={team.teamLogo} alt={team.teamName} />
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
    </div>
  );
};

export default TeamList;
