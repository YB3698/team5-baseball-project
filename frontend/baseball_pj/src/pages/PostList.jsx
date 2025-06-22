import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Board.css';

const PostList = () => {
  const [search, setSearch] = useState('');
  const [teamFilter, setTeamFilter] = useState('');
  const [myPostsOnly, setMyPostsOnly] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [posts, setPosts] = useState([]); // ← DB에서 받아올 게시글 목록
  const [teams, setTeams] = useState([]);

  // 게시글 목록 불러오기
  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => console.error('게시글 목록 로딩 실패:', err));
  }, []);

  // 팀 목록 불러오기
  useEffect(() => {
    fetch('/api/teams')
      .then(res => res.json())
      .then(data => setTeams(data))
      .catch(err => console.error('팀 목록 로딩 실패:', err));
  }, []);

  // 검색/필터 적용
  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.postTitle?.toLowerCase().includes(search.toLowerCase());
    const matchesTeam = !teamFilter || String(post.teamId) === String(teamFilter);
    // author 필드는 백엔드에서 내려주는 경우에만 사용
    return matchesSearch && matchesTeam;
  });

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
            <option key={team.teamId || team.id} value={team.teamId || team.id}>
              {team.teamName || team.name}
            </option>
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

      {/* ✏️ 글쓰기 버튼 */}
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
                const team = teams.find(t => (t.teamId || t.id) === post.teamId);
                return (
                  <tr
                    key={post.postId || post.id || idx}
                    onClick={() => setSelectedPost(post)}
                    className="hoverable-row"
                  >
                    <td>
                      {team && team.teamLogo
                        ? <img src={team.teamLogo} alt={team.teamName || team.name} style={{ width: "50px"}} />
                        : team?.teamName || team?.name || post.teamId}
                    </td>
                    <td className="title-cell">{post.postTitle || post.title}</td>
                    <td>{post.author || post.userId}</td>
                    <td>{post.postCreatedAt || post.createdAt}</td>
                    <td>{post.views ?? '-'}</td>
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

      {/* 게시글 상세 보기 */}
      
      {selectedPost && (
        <div className="detail-actions">
       
      <button className="back-btn" onClick={() => setSelectedPost(null)}>뒤로 가기</button>
        <div className="post-detail">
          <h3>{selectedPost.postTitle || selectedPost.title}</h3>
          <p className="post-content">{selectedPost.postContent || selectedPost.content}</p>
          <div className="meta">
            작성자: {selectedPost.author || selectedPost.userId} | 작성일: {selectedPost.postCreatedAt || selectedPost.createdAt}
          </div>
          <div className="actions align-right">
            
            
            <button className="edit-btn" onClick={() => alert('수정 기능은 추후 구현!')}>수정</button>
      <button className="delete-btn" onClick={() => alert('삭제 기능은 추후 구현!')}>삭제</button>
            
          </div>
          </div>
    </div>
  )
      }
    </div>
  );
};

export default PostList;