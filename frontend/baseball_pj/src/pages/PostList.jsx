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
  
  // 페이징 관련 state 추가
  const [currentPage, setCurrentPage] = useState(0);
  const [postsPerPage] = useState(10); // 페이지당 게시글 수

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
    .then(data => {
      // 최신순으로 정렬 (postCreatedAt 기준 내림차순)
      const sortedPosts = data.sort((a, b) => {
        return new Date(b.postCreatedAt) - new Date(a.postCreatedAt);
      });
      setPosts(sortedPosts);
    })
    .catch(err => console.error('게시글 목록 로딩 실패:', err));
};

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    fetch('/api/teams')
      .then(res => res.json())
      .then(data => {
        console.log('팀 데이터:', data); // 디버깅용
        // 팀 ID가 1~10번인 팀만 필터링
        const filteredTeams = data.filter(team => team.teamId >= 1 && team.teamId <= 10);
        setTeams(filteredTeams);
      })
      .catch(err => console.error('팀 목록 로딩 실패:', err));
  }, []);

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.postTitle?.toLowerCase().includes(search.toLowerCase());
    const matchesTeam = !teamFilter || String(post.teamId) === String(teamFilter);
    // 팀 ID가 1~10번인 게시글만 표시
    const validTeam = post.teamId >= 1 && post.teamId <= 10;
    return matchesSearch && matchesTeam && validTeam;
  });

  // 현재 페이지에 보여줄 게시글 계산
  const indexOfLastPost = (currentPage + 1) * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  // 전체 페이지 수 계산
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // 페이지 변경 함수
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 검색이나 필터 변경 시 첫 페이지로 이동
  useEffect(() => {
    setCurrentPage(0);
  }, [search, teamFilter]);

  // 팀 선택 함수
  const handleTeamSelect = (teamId) => {
    setTeamFilter(teamId === teamFilter ? '' : String(teamId)); // 같은 팀 클릭시 해제
    setCurrentPage(0); // 첫 페이지로 이동
  };

  // 페이징 버튼 렌더링 함수
  const renderPagination = () => {
    const pageButtons = [];
    const startPage = Math.max(0, currentPage - 2);
    const endPage = Math.min(totalPages - 1, currentPage + 2);

    // 이전 버튼
    if (currentPage > 0) {
      pageButtons.push(
        <button 
          key="prev" 
          onClick={() => handlePageChange(currentPage - 1)}
          className="page-btn"
        >
          이전
        </button>
      );
    }

    // 페이지 번호 버튼들 (최대 5개)
    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`page-btn ${currentPage === i ? 'active' : ''}`}
        >
          {i + 1}
        </button>
      );
    }

    // 다음 버튼
    if (currentPage < totalPages - 1) {
      pageButtons.push(
        <button 
          key="next" 
          onClick={() => handlePageChange(currentPage + 1)}
          className="page-btn"
        >
          다음
        </button>
      );
    }

    return <div className="pagination">{pageButtons}</div>;
  };

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

      {/* 팀 로고 필터 - 게시글 리스트에서만 표시 */}
      {!selectedPost && (
        <div className="team-filter-container">
          <div className="team-logos">
            <div 
              className={`team-logo-item ${teamFilter === '' ? 'active' : ''}`}
              onClick={() => handleTeamSelect('')}
            >
              <div className="all-teams">전체</div>
            </div>
            {teams.map((team) => (
              <div 
                key={team.teamId}
                className={`team-logo-item ${String(teamFilter) === String(team.teamId) ? 'active' : ''}`}
                onClick={() => handleTeamSelect(team.teamId)}
                title={team.teamName} // 툴팁 추가
              >
                {team.teamLogo ? (
                  <img 
                    src={team.teamLogo} 
                    alt={team.teamName} 
                    className="team-logo-img"
                    onError={(e) => {
                      // 이미지 로드 실패 시 팀 이름으로 대체
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                ) : null}
                <div 
                  className="team-name-fallback" 
                  style={{ display: team.teamLogo ? 'none' : 'block' }}
                >
                  {team.teamName}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 글쓰기 버튼 - 게시글 리스트에서만 표시 */}
      {!selectedPost && (
        <div className="post-actions">
          <Link to="/postform" className="write-btn small">글쓰기</Link>
        </div>
      )}

      {/* 게시글 리스트 */}
      {!selectedPost && (
        <div className="post-box post-box-custom">
          <div className="post-count">총 {filteredPosts.length}건 (페이지 {currentPage + 1}/{totalPages})</div>
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
              {currentPosts.map((post, idx) => {
                const team = teams.find(t => t.teamId === post.teamId);
                return (
                  <tr
                    key={post.postId}
                    onClick={() => { setSelectedPost(post); setIsEditing(false); }}
                    className="hoverable-row"
                  >
                    <td>
                      {team?.teamLogo ? (
                        <img 
                          src={team.teamLogo} 
                          alt={team.teamName} 
                          style={{ width: "40px", height: "40px", objectFit: "contain" }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'inline';
                          }}
                        />
                      ) : null}
                      <span style={{ display: team?.teamLogo ? 'none' : 'inline' }}>
                        {team?.teamName || `팀 ${post.teamId}`}
                      </span>
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
          
          {/* 페이징 버튼 추가 */}
          {totalPages > 1 && renderPagination()}
          
          {filteredPosts.length === 0 && (
            <p style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
              검색 결과가 없습니다.
            </p>
          )}

          {/* 검색 입력 - 게시글 리스트에서만 표시 */}
          <div className="post-controls">
            <input
              type="text"
              placeholder="게시글 검색"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
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
                  작성자: {selectedPost.nickname} | 작성일: {formatDate(selectedPost.postCreatedAt)}
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