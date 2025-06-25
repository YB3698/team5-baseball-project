import { useEffect, useState } from 'react';
import axios from 'axios';
import './TeamList.css';

const homepageLinks = {
  'SSG 랜더스': 'https://www.ssglanders.com/',
  'LG 트윈스': 'https://www.lgtwins.com/',
  '두산 베어스': 'https://www.doosanbears.com/',
  '롯데 자이언츠': 'https://www.giantsclub.com/',
  '삼성 라이온즈': 'https://www.samsunglions.com/',
  '한화 이글스': 'https://www.hanwhaeagles.co.kr/',
  'KIA 타이거즈': 'https://www.tigers.co.kr/',
  'NC 다이노스': 'https://www.ncdinos.com/',
  'KT 위즈': 'https://www.ktwiz.co.kr/',
  '키움 히어로즈': 'https://www.heroesbaseball.co.kr/'
};

const TeamList = () => {
  const [teams, setTeams] = useState([]);
  const [selectedTeamName, setSelectedTeamName] = useState('');

  useEffect(() => {
    axios.get('/api/teams')
      .then(res => {
        const sortedTeams = res.data.sort((a, b) =>
          a.teamName.localeCompare(b.teamName, 'ko')
        );
        setTeams(sortedTeams);
      })
      .catch(err => console.error('팀 정보 로딩 실패:', err));
  }, []);

  const filteredTeams = selectedTeamName
    ? teams.filter(
        team =>
          team.teamName === selectedTeamName &&
          team.teamId >= 1 &&
          team.teamId <= 10
      )
    : teams.filter(team => team.teamId >= 1 && team.teamId <= 10);

  return (
    <div className="team-page-container">
      <h2 className="team-title">팀 목록</h2>
      <div className="section-line" />

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
                    homepageLinks[team.teamName] ? (
                      <a
                        href={homepageLinks[team.teamName]}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`${team.teamName} 공식 홈페이지로 이동`}
                      >
                        <img src={team.teamLogo} alt={team.teamName} />
                      </a>
                    ) : (
                      <img src={team.teamLogo} alt={team.teamName} />
                    )
                  ) : (
                    '이미지 없음'
                  )}
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
