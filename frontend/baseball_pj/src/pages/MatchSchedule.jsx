import React, { useEffect, useState } from 'react';
import './MatchSchedule.css';

function MatchSchedule() {
  const [games, setGames] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');

  useEffect(() => {
    fetch('/api/schedule')
      .then((res) => res.json())
      .then((data) => {
        const validGames = data
          .filter(game => game.gameDate && !isNaN(new Date(game.gameDate)))
          .sort((a, b) => new Date(a.gameDate) - new Date(b.gameDate));
        setGames(validGames);
      });
  }, []);

  const today = new Date();
  const defaultYear = today.getFullYear();
  const defaultMonth = (today.getMonth() + 1).toString().padStart(2, '0');

  const filteredGames = games.filter((game) => {
    const gameDate = new Date(game.gameDate);
    if (isNaN(gameDate)) return false;

    const year = gameDate.getFullYear().toString();
    const month = (gameDate.getMonth() + 1).toString().padStart(2, '0');

    const filterYear = selectedYear || defaultYear.toString();
    const filterMonth = selectedMonth || defaultMonth;

    return year === filterYear && month === filterMonth;
  });

  const groupedGames = filteredGames.reduce((acc, game) => {
    const dateKey = game.gameDate.split('T')[0];
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(game);
    return acc;
  }, {});

  const handleYearChange = (e) => setSelectedYear(e.target.value);
  const handleMonthChange = (e) => setSelectedMonth(e.target.value);

  return (
    <div className="schedule-container" style={{ paddingTop: '140px' }}>
      <h2 className="schedule-title">경기일정・결과</h2>

      <div className="schedule-controls">
        <select onChange={handleYearChange} value={selectedYear || defaultYear}>
          {Array.from({ length: 30 }, (_, i) => 2001 + i).map((year) => (
            <option key={year} value={year}>{year}년</option>
          ))}
        </select>
        <select onChange={handleMonthChange} value={selectedMonth || defaultMonth}>
          {Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0')).map((month) => (
            <option key={month} value={month}>{month}월</option>
          ))}
        </select>
      </div>

      <div className="schedule-card">
        <table className="schedule-table">
          <thead>
            <tr>
              <th>날짜</th>
              <th>시간</th>
              <th>경기</th>
              <th>구장</th>
              <th>비고</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedGames).map(([dateKey, games]) => {
              const parsedDate = new Date(dateKey);
              const displayDate = `${(parsedDate.getMonth() + 1).toString().padStart(2, '0')}. ${(parsedDate.getDate()).toString().padStart(2, '0')} (${parsedDate.toLocaleDateString('ko-KR', { weekday: 'short' })})`;

              return (
                <React.Fragment key={dateKey}>
                  {games.map((game, idx) => (
                    <tr key={idx} className={idx === 0 ? 'date-row' : ''}>
                      {idx === 0 && (
                        <td rowSpan={games.length} className="date-cell">
                          {displayDate}
                        </td>
                      )}
                      <td>{game.gameDate.split('T')[1]?.slice(0, 5) || '-'}</td>
                      <td>
                        {game.homeTeamName} <span className="score">{game.homeScore} vs {game.awayScore}</span> {game.awayTeamName}
                      </td>
                      <td>{game.stadium}</td>
                      <td>{game.isRainedOut === 'Y' ? '우천취소' : ''}</td>
                    </tr>
                  ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MatchSchedule;
