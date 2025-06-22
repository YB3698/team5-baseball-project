// PostList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Board.css';

const dummyPosts = [
  { id: 1, teamId: 2, title: '경기 후기', author: '홍길동', createdAt: '2025-06-19', views: 14, content: '경기 정말 멋졌어요!' },
  { id: 2, teamId: 1, title: '선수 이적 소식', author: '임꺽정', createdAt: '2025-06-17', views: 21, content: '누가 이적했는지 아세요?' },
];

const PostList = () => {
  const [search, setSearch] = useState('');
  const [teamFilter, setTeamFilter] = useState('');
  const [myPostsOnly, setMyPostsOnly] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [posts] = useState(dummyPosts);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    // 팀 목록을 백엔드에서 받아옴 (team_logo는 이미지 링크)
    fetch('/api/teams')
      .then(res => res.json())
      .then(data => setTeams(data))
      .catch(err => console.error('팀 목록 로딩 실패:', err));
  }, []);

  // 검색 버튼 없이 바로 필터 적용
  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase());
    const matchesTeam = !teamFilter || String(post.teamId) === String(teamFilter);
    const matchesAuthor = !myPostsOnly || post.author === dummyUser.nickname;
    return matchesSearch && matchesTeam && matchesAuthor;
  });
  console.log('search:', search, 'teamFilter:', teamFilter, 'myPostsOnly:', myPostsOnly, 'filteredPosts:', filteredPosts);

  return (
    <div className={`post-list page-container ${selectedPost ? '' : 'show-header'}`}>
      <h2>게시판</h2>

      {/* 🔍 검색 필터 */}
      <div className="post-controls">
        <select
          value={teamFilter}
          onChange={(e) => setTeamFilter(e.target.value)}
          className="search-select"
        >
          <option value="">전체 팀</option>
          {teams.map((team) => (
            <option key={team.teamId} value={team.teamId}>{team.teamName}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="제목 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      {/* ✏️ 글쓰기 버튼만 유지 */}
      <div className="post-actions">
        <Link to="/postform" className="write-btn small">글쓰기</Link>
      </div>

      {/* 게시글 리스트 */}
      {!selectedPost && (
        <div className="post-box post-box-custom">
          <div className="post-count">총 {filteredPosts.length}건</div>
          <table className="post-table">
            <thead>
              <tr>
                <th>팀</th>
                <th>제목</th>
                <th>작성자</th>
                <th>등록일</th>
                <th>조회수</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map((post, idx) => {
                const team = teams.find(t => t.teamId === post.teamId);
                return (
                  <tr
                    key={post.id || idx}
                    onClick={() => setSelectedPost(post)}
                    className="hoverable-row"
                  >
                    <td>
                      {team && team.teamLogo
                        ? <img src={team.teamLogo} alt={team.teamName} style={{ width: "50px"}} />
                        : post.teamName}
                    </td>
                    <td className="title-cell">{post.title}</td>
                    <td>{post.author}</td>
                    <td>{post.createdAt}</td>
                    <td>{post.views}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredPosts.length === 0 && (
            <p style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
              검색 결과가 없습니다.
            </p>
          )}
        </div>
      )}

      {/* 🔍 게시글 상세 보기 */}
      {selectedPost && (
        <div className="post-detail">
          <h3>{selectedPost.title}</h3>
          <p className="post-content">{selectedPost.content}</p>
          <div className="meta">
            작성자: {selectedPost.author} | 작성일: {selectedPost.createdAt}
          </div>
          <div className="actions align-right">
            <button>수정</button>
            <button>삭제</button>
            <button onClick={() => setSelectedPost(null)}>뒤로 가기</button>
          </div>
          <div className="comment-box">
            <h4>댓글</h4>
            <textarea rows={4} placeholder="댓글을 입력하세요"></textarea>
            <button>댓글 작성</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostList;
