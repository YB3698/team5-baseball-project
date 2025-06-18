import { useEffect, useState } from 'react';
import './PlayerList.css';

const parseCSV = (csvText) => {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const data = lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim());
    const entry = {};
    headers.forEach((header, index) => {
      entry[header] = values[index];
    });
    return entry;
  });
  return data;
};

const ITEMS_PER_PAGE = 10;

const PlayerList = () => {
  const [players, setPlayers] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchPosition, setSearchPosition] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetch('/team_players.csv')
      .then(res => res.text())
      .then(text => {
        const parsed = parseCSV(text);
        setPlayers(parsed);
        setFiltered(parsed); // 초기엔 전체 표시
      })
      .catch(err => {
        console.error('CSV 로드 오류:', err);
      });
  }, []);

  const handleSearch = () => {
    const result = players.filter(player =>
      (searchName === '' || player.PLAYER_NAME?.includes(searchName)) &&
      (searchPosition === '' || player.PLAYER_POSITION?.includes(searchPosition))
    );
    setFiltered(result);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedPlayers = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getPageNumbers = () => {
    const visibleCount = 5;
    let start = Math.max(1, currentPage - Math.floor(visibleCount / 2));
    let end = start + visibleCount - 1;
    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - visibleCount + 1);
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div className="playerlist-container">
      <h2 className="playerlist-title">선수 조회</h2>

      <div className="playerlist-search-advanced">
        <input
          type="text"
          placeholder="이름"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <select
          value={searchPosition}
          onChange={(e) => setSearchPosition(e.target.value)}
        >
          <option value="">포지션 선택</option>
          <option value="투수">투수</option>
          <option value="포수">포수</option>
          <option value="내야수">내야수</option>
          <option value="외야수">외야수</option>
        </select>
        <button onClick={handleSearch}>검색</button>
      </div>

      {/* ✅ 검색 결과 표시 (왼쪽 정렬) */}
      <p className="playerlist-count">
        검색 결과: <strong>{filtered.length || players.length}</strong>건
      </p>

      <div className="playerlist-card">
        {paginatedPlayers.length > 0 ? (
          <table className="playerlist-table">
            <thead>
              <tr>
                <th>이름</th>
                <th>포지션</th>
                <th>등번호</th>
                <th>생년월일</th>
                <th>신체정보</th>
                <th>출신 경로</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPlayers.map((player) => (
                <tr key={player.PLAYER_ID}>
                  <td>{player.PLAYER_NAME}</td>
                  <td>{player.PLAYER_POSITION}</td>
                  <td>{player.PLAYER_BACK_NUMBER}</td>
                  <td>{player.PLAYER_BIRTH_DATE}</td>
                  <td>{player.PLAYER_HEIGHT_WEIGHT}</td>
                  <td>{player.PLAYER_EDUCATION_PATH}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
            검색 결과가 없습니다.
          </p>
        )}
      </div>

      <div className="pagination">
        <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>«</button>
        <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>‹</button>

        {getPageNumbers().map(num => (
          <button
            key={num}
            onClick={() => setCurrentPage(num)}
            className={num === currentPage ? 'active' : ''}
          >
            {num}
          </button>
        ))}

        <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>›</button>
        <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>»</button>
      </div>
    </div>
  );
};

export default PlayerList;
