import React, { useEffect, useState, useMemo } from 'react';
import './MatchSchedule.css';

function MatchSchedule() {
  const today = useMemo(() => new Date(), []);
  const defaultYear = today.getFullYear().toString();
  const defaultMonth = (today.getMonth() + 1).toString().padStart(2, '0');

  const [selectedYear, setSelectedYear] = useState(defaultYear);
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/schedule?year=${selectedYear}&month=${selectedMonth}`)
      .then((res) => res.json())
      .then((data) => {
        const validGames = data
          .filter(game => game.gameDate && !isNaN(new Date(game.gameDate)))
          .sort((a, b) => new Date(a.gameDate) - new Date(b.gameDate));
        setGames(validGames);
        setLoading(false);
      })
      .catch(err => {
        console.error('API 오류:', err);
        setLoading(false);
      });
  }, [selectedYear, selectedMonth]);

  const groupedGames = useMemo(() => {
    return games.reduce((acc, game) => {
      const dateKey = game.gameDate.split('T')[0];
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(game);
      return acc;
    }, {});
  }, [games]);

  const handleYearChange = (e) => setSelectedYear(e.target.value);
  const handleMonthChange = (e) => setSelectedMonth(e.target.value);

  return (
    <div className="schedule-container" style={{ paddingTop: '140px' }}>
      <h2 className="schedule-title">경기일정・결과</h2>

      <div className="schedule-controls">
        <select onChange={handleYearChange} value={selectedYear}>
          {Array.from({ length: 30 }, (_, i) => (2001 + i).toString()).map((year) => (
            <option key={year} value={year}>{year}년</option>
          ))}
        </select>
        <select onChange={handleMonthChange} value={selectedMonth}>
          {Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0')).map((month) => (
            <option key={month} value={month}>{month}월</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="loading">불러오는 중...</div>
      ) : (
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
                    <tr key={idx}>
                      {idx === 0 && (
                        <td rowSpan={games.length} className="date-cell">
                          {displayDate}
                        </td>
                      )}
                      <td>{game.gameDate.split('T')[1]?.slice(0, 5) || '-'}</td>
                      <td>
                        {game.homeTeamName}{' '}
                        <span className="score">
                          <span className={game.homeScore > game.awayScore ? 'score-red' : 'score-blue'}>
                            {game.homeScore}
                          </span>
                          {' '}
                          <span className="score-vs">vs</span>
                          {' '}
                          <span className={game.awayScore > game.homeScore ? 'score-red' : 'score-blue'}>
                            {game.awayScore}
                          </span>
                        </span>{' '}
                        {game.awayTeamName}
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
      )}
    </div>
  );
}

export default MatchSchedule;
