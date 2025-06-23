import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Board.css';
import axios from 'axios';
import Comments from '../components/Comments';


const PostList = () => {
  const [search, setSearch] = useState('');
  const [teamFilter, setTeamFilter] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [posts, setPosts] = useState([]);
  const [teams, setTeams] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const fetchPosts = () => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => console.error('게시글 목록 로딩 실패:', err));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    fetch('/api/teams')
      .then(res => res.json())
      .then(data => setTeams(data))
      .catch(err => console.error('팀 목록 로딩 실패:', err));
  }, []);

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.postTitle?.toLowerCase().includes(search.toLowerCase());
    const matchesTeam = !teamFilter || String(post.teamId) === String(teamFilter);
    return matchesSearch && matchesTeam;
  });

  const handleEdit = () => {
    setEditTitle(selectedPost.postTitle);
    setEditContent(selectedPost.postContent);
    setIsEditing(true);
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(
        `/api/posts/${selectedPost.postId}`,
        {
          postTitle: editTitle,
          postContent: editContent,
        },
        { withCredentials: true }
      );
      alert('수정 완료');
      setIsEditing(false);
      setSelectedPost(null);
      fetchPosts();
    } catch (err) {
      alert('수정 실패');
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await axios.delete(`/api/posts/${selectedPost.postId}`, {
        withCredentials: true,
      });
      alert('삭제 완료');
      setSelectedPost(null);
      fetchPosts();
    } catch (err) {
      alert('삭제 실패');
      console.error(err);
    }
  };

  return (
    <div className={`post-list page-container ${selectedPost ? '' : 'show-header'}`}>
      <h2>게시판</h2>

      {/* 검색 필터 */}
      <div className="post-controls">
        <select
          value={teamFilter}
          onChange={(e) => setTeamFilter(e.target.value)}
          className="search-select"
        >
          <option value="">전체 팀</option>
          {teams.map((team) => (
            <option key={team.teamId} value={team.teamId}>
              {team.teamName}
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

      {/* 글쓰기 버튼 */}
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
                    key={post.postId}
                    onClick={() => { setSelectedPost(post); setIsEditing(false); }}
                    className="hoverable-row"
                  >
                    <td>
                      {team?.teamLogo
                        ? <img src={team.teamLogo} alt={team.teamName} style={{ width: "50px" }} />
                        : team?.teamName || post.teamId}
                    </td>
                    <td className="title-cell">{post.postTitle}</td>
                    <td>{post.nickname}</td>
                    <td>{formatDate(post.postCreatedAt)}</td>
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

      {/* 상세 보기 또는 수정 폼 */}
      {selectedPost && (
        <div className="detail-actions">
          <button className="back-btn" onClick={() => { setSelectedPost(null); setIsEditing(false); }}>뒤로 가기</button>
          <div className="post-detail">
            {isEditing ? (
              <>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  style={{ width: '100%', fontSize: '1.2rem', marginBottom: '1rem' }}
                />
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={10}
                  style={{ width: '100%' }}
                />
                <div className="actions align-right">
                  <button className="submit-btn" onClick={handleEditSubmit}>수정 완료</button>
                  <button className="back-btn" onClick={() => setIsEditing(false)}>취소</button>
                </div>
              </>
            ) : (
              <>
                <h3>{selectedPost.postTitle}</h3>
                <p className="post-content">{selectedPost.postContent}</p>
                <div className="meta">
                  작성자: {selectedPost.userId} | 작성일: {formatDate(selectedPost.postCreatedAt)}
                </div>
                {(() => {
                  const storedUser = JSON.parse(localStorage.getItem('user'));
                  const loggedInUserId = storedUser?.userId;
                  if (Number(loggedInUserId) === Number(selectedPost.userId)) {
                    return (
                      <div className="actions align-right">
                        <button className="edit-btn" onClick={handleEdit}>수정</button>
                        <button className="delete-btn" onClick={handleDelete}>삭제</button>
                      </div>
                    );
                  }
                  return null;
                })()}
              </>
            )}
     
            {/* 댓글 컴포넌트 분리 */}
            <Comments postId={selectedPost.postId || selectedPost.id} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PostList;
