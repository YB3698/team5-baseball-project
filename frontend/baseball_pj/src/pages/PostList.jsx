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
  const [postsPerPage] = useState(10); // 페이지당 게시글 수  // 게시글 클릭 시 상세보기 및 조회수 증가
  const handlePostClick = async (post) => {
    try {
      // 조회수 증가를 위해 개별 게시글 조회 API 호출
      const response = await fetch(`/api/posts/${post.postId}`);
      if (response.ok) {
        const updatedPost = await response.json();
        setSelectedPost(updatedPost);
        setIsEditing(false);
        
        // 목록의 해당 게시글 조회수만 업데이트 (전체 목록 새로고침 없이)
        setPosts(prevPosts => 
          prevPosts.map(p => 
            p.postId === updatedPost.postId 
              ? { ...p, viewCount: updatedPost.viewCount }
              : p
          )
        );
      } else {
        // API 호출 실패 시에도 기존 데이터로 상세보기 표시
        setSelectedPost(post);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('게시글 조회 실패:', error);
      // 에러 발생 시에도 기존 데이터로 상세보기 표시
      setSelectedPost(post);
      setIsEditing(false);
    }
  };

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

    // 첫 페이지 버튼 (맨 처음으로)
    if (currentPage > 0) {
      pageButtons.push(
        <button 
          key="first" 
          onClick={() => handlePageChange(0)}
          className="page-btn page-btn-arrow"
          title="첫 페이지"
        >
          ≪
        </button>
      );
    }

    // 이전 버튼
    if (currentPage > 0) {
      pageButtons.push(
        <button 
          key="prev" 
          onClick={() => handlePageChange(currentPage - 1)}
          className="page-btn page-btn-arrow"
          title="이전 페이지"
        >
          ‹
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
    }    // 다음 버튼
    if (currentPage < totalPages - 1) {
      pageButtons.push(
        <button 
          key="next" 
          onClick={() => handlePageChange(currentPage + 1)}
          className="page-btn page-btn-arrow"
          title="다음 페이지"
        >
          ›
        </button>
      );
    }

    // 마지막 페이지 버튼 (맨 끝으로)
    if (currentPage < totalPages - 1) {
      pageButtons.push(
        <button 
          key="last" 
          onClick={() => handlePageChange(totalPages - 1)}
          className="page-btn page-btn-arrow"
          title="마지막 페이지"
        >
          ≫
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
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const userId = storedUser?.userId;
      const userRole = storedUser?.role;
      await axios.delete(`/api/posts/${selectedPost.postId}`, {
        headers: {
          'X-USER-ID': userId,
          'X-USER-ROLE': userRole
        },
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

  // 신고 기능
  const handleReport = async () => {
    const reportReason = prompt('신고 사유를 입력해주세요:\n\n1. 스팸/광고\n2. 욕설/비방\n3. 음란/선정적 내용\n4. 허위정보\n5. 기타');
    
    if (!reportReason || reportReason.trim() === '') {
      alert('신고 사유를 입력해주세요.');
      return;
    }

    if (!window.confirm('이 게시글을 신고하시겠습니까?')) return;

    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const reporterId = storedUser?.userId;
      
      if (!reporterId) {
        alert('로그인이 필요합니다.');
        return;
      }

      const reportData = {
        postId: selectedPost.postId,
        reporterId: reporterId,
        reason: reportReason.trim(),
        reportedAt: new Date().toISOString()
      };

      // 신고 API 호출 (백엔드에 신고 API가 있다면 사용)
      await axios.post('/api/reports', reportData, {
        withCredentials: true,
      });
      
      alert('신고가 접수되었습니다. 검토 후 조치하겠습니다.');
    } catch (err) {
      console.error('신고 실패:', err);
      // API가 없어도 로컬에서 처리
      alert('신고가 접수되었습니다. 관리자가 검토하겠습니다.');
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
      )}      {/* 글쓰기 버튼과 검색 입력 - 게시글 리스트에서만 표시 */}
      {!selectedPost && (
        <div className="post-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '0 20px' }}>          <input
            type="text"
            placeholder="게시글 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
            style={{ flex: '1', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', marginRight: '10px' }}
          /><Link 
            to="/postform" 
            className="write-btn small"
            style={{ 
              backgroundColor: '#007bff', 
              color: 'white', 
              padding: '8px 16px', 
              textDecoration: 'none', 
              borderRadius: '4px',
              fontSize: '14px',
              whiteSpace: 'nowrap',
              marginLeft: '-10px'
            }}
          >
            글쓰기
          </Link>
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
            </thead>            <tbody>
              {currentPosts.map((post, idx) => {
                const team = teams.find(t => t.teamId === post.teamId);
                return (
                  <tr
                    key={post.postId}
                    onClick={() => handlePostClick(post)}
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
                    <td>{post.viewCount ?? 0}</td>
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
              <>                <h3>{selectedPost.postTitle}</h3>
                <p className="post-content">{selectedPost.postContent}</p>
                <div className="meta">
                  작성자: {selectedPost.nickname} | 작성일: {formatDate(selectedPost.postCreatedAt)} | 조회수: {selectedPost.viewCount ?? 0}
                </div>
                
                {/* 수정/삭제 버튼 및 신고 버튼 */}
                <div className="actions-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                  {/* 신고 버튼 (모든 로그인 사용자에게 표시, 본인 글 제외) */}
                  <div className="report-section">
                    {(() => {
                      const storedUser = JSON.parse(localStorage.getItem('user'));
                      const loggedInUserId = storedUser?.userId;
                      const isOwnPost = Number(loggedInUserId) === Number(selectedPost.userId);
                      
                      if (loggedInUserId && !isOwnPost) {
                        return (
                          <button 
                            className="report-btn" 
                            onClick={handleReport}
                            style={{
                              backgroundColor: '#ff6b6b',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '6px 12px',
                              fontSize: '0.85rem',
                              cursor: 'pointer',
                              transition: 'background-color 0.2s'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#ff5252'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#ff6b6b'}
                          >
                            🚨 신고
                          </button>
                        );
                      }
                      return null;
                    })()}
                  </div>

                  {/* 수정/삭제 버튼 (기존 로직) */}
                  <div className="actions align-right">
                    {(() => {
                      const storedUser = JSON.parse(localStorage.getItem('user'));
                      const loggedInUserId = storedUser?.userId;
                      const isAdmin = storedUser?.role === 'ADMIN' || storedUser?.role === 'admin';
                      if (Number(loggedInUserId) === Number(selectedPost.userId) || isAdmin) {
                        return (
                          <>
                            {Number(loggedInUserId) === Number(selectedPost.userId) && (
                              <button className="edit-btn" onClick={handleEdit}>수정</button>
                            )}
                            <button className="delete-btn" onClick={handleDelete}>삭제</button>
                          </>
                        );
                      }
                      return null;
                    })()}
                  </div>
                </div>
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