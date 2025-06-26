import { useEffect, useState } from 'react';
import axios from 'axios';
import './Mypage.css';

const kboTeams = [
  { id: 1, name: 'NC 다이노스' },
  { id: 2, name: '롯데 자이언츠' },
  { id: 3, name: '삼성 라이온스' },
  { id: 4, name: 'KIA 타이거즈' },
  { id: 5, name: 'LG 트윈스' },
  { id: 6, name: '두산 베어스' },
  { id: 7, name: 'KT 위즈' },
  { id: 8, name: 'SSG 랜더스' },
  { id: 9, name: '한화 이글스' },
  { id: 10, name: '키움 히어로즈' },
];

const MyPage = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('info');
  const [subTab, setSubTab] = useState('posts');

  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [teamId, setTeamId] = useState(1);
  const [hasChangedTeam, setHasChangedTeam] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [myPosts, setMyPosts] = useState([]);
  const [myComments, setMyComments] = useState([]);

  const [editPostId, setEditPostId] = useState(null);
  const [editPostTitle, setEditPostTitle] = useState('');
  const [editPostContent, setEditPostContent] = useState('');

  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState('');

  const [deletedPosts, setDeletedPosts] = useState({}); // postId: true(삭제됨)

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const u = JSON.parse(stored);
      setUser(u);
      setNickname(u.nickname);
      setEmail(u.email);
      setTeamId(u.teamId);
      setHasChangedTeam(u.hasChangedTeam || false);

      axios.get('/api/posts')
        .then(res => {
          const posts = res.data
            .filter(p => p.userId === u.userId)
            .sort((a, b) => new Date(b.postCreatedAt) - new Date(a.postCreatedAt));
          setMyPosts(posts);
        });

      axios.get(`/api/user-comments?userId=${u.userId}`)
        .then(async res => {
          const sorted = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setMyComments(sorted);
          // 게시글 존재 여부 체크
          const postIds = Array.from(new Set(sorted.map(c => c.postId).filter(Boolean)));
          const deleted = {};
          await Promise.all(postIds.map(async pid => {
            try {
              await axios.get(`/api/posts/${pid}`);
            } catch {
              deleted[pid] = true;
            }
          }));
          setDeletedPosts(deleted);
        });
    }
  }, []);



  const handleSavePost = () => {
    axios.put(`/api/posts/${editPostId}`, {
      postTitle: editPostTitle,
      postContent: editPostContent,
      userId: user.userId
    }).then(res => {
      const updated = myPosts.map(p =>
        p.postId === editPostId ? res.data : p
      );
      setMyPosts(updated);
      setEditPostId(null);
    });
  };


  const handleSaveComment = () => {
    axios.put(`/api/comments/${editCommentId}`, {
      content: editCommentContent,
      userId: user.userId
    }).then(() => {
      const updated = myComments.map(c =>
        c.commentId === editCommentId ? { ...c, content: editCommentContent } : c
      );
      setMyComments(updated);
      setEditCommentId(null);
    });
  };

  const handleTeamChange = (e) => {
    const newTeamId = parseInt(e.target.value);
    if (hasChangedTeam) {
      alert("응원 팀은 한 번만 변경할 수 있습니다.");
      return;
    }
    setTeamId(newTeamId);
  };

  const handleSaveInfo = () => {
    const isTeamChanged = teamId !== user.teamId;

    axios.put(`/api/users/${user.userId}/update-info`, {
      nickname,
      email,
      teamId
    }).then(() => {
      if (isTeamChanged) {
        alert("응원 팀이 변경되어 로그아웃됩니다.");
        localStorage.removeItem('user');
        window.location.href = '/login';
        return;
      }

      const updatedUser = {
        ...user,
        nickname,
        email,
        teamId,
        hasChangedTeam: hasChangedTeam // 기존 값 유지 (팀 변경이 실제로 일어난 경우만 true)
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setIsEditing(false);
      alert("정보가 수정되었습니다.");
    }).catch(() => {
      alert("수정에 실패했습니다.");
    });
  };

  // 대댓글(postId 없고 parentId만 있는 경우)도 postId를 찾아서 board/{postId}#comment-{commentId}로 이동 (재귀 추적)
  function getBoardLink(comment, allComments) {
    let current = comment;
    let depth = 0;
    while (current && !current.postId && current.parentId && depth < 10) {
      current = allComments.find(c2 => c2.commentId === current.parentId);
      depth++;
    }
    if (current && current.postId) {
      return { link: `/board/${current.postId}#comment-${comment.commentId}`, canMove: true, postIdUsed: current.postId };
    }
    return { link: '', canMove: false, postIdUsed: null };
  }

  if (!user) return null;

  return (
    <div className="mypage-container">
      <h2 className="mypage-title">마이페이지</h2>
      <hr className="mypage-divider" />
      <div className="mypage-layout">
        <div className="mypage-sidebar">
          <button className={`mypage-tab ${activeTab === 'info' ? 'active' : ''}`} onClick={() => setActiveTab('info')}>정보확인</button>
          <button className={`mypage-tab ${activeTab === 'activity' ? 'active' : ''}`} onClick={() => setActiveTab('activity')}>내 활동</button>
        </div>

        <div className="mypage-content">
          {activeTab === 'info' && (
            <div className="mypage-card">
              {!isEditing ? (
                <>
                  <div className="mypage-info-item">
                    <div className="mypage-info-label">닉네임</div>
                    <div className="mypage-info-value">{nickname}</div>
                  </div>
                  <div className="mypage-info-item">
                    <div className="mypage-info-label">이메일</div>
                    <div className="mypage-info-value">{email}</div>
                  </div>
                  <div className="mypage-info-item">
                    <div className="mypage-info-label">응원 팀</div>
                    <div className="mypage-info-value">{kboTeams.find(t => t.id === teamId)?.name || '-'}</div>
                  </div>
                  <div>
                    <button className="edit" onClick={() => setIsEditing(true)}>수정</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="mypage-info-item">
                    <div className="mypage-info-label">닉네임</div>
                    <input value={nickname} disabled style={{ background: '#f5f5f5', color: '#888' }} />
                  </div>
                  <div className="mypage-info-item">
                    <div className="mypage-info-label">이메일</div>
                    <input value={email} disabled style={{ background: '#f5f5f5', color: '#888' }} />
                  </div>
                  <div className="mypage-info-item">
                    <div className="mypage-info-label">응원 팀</div>
                    <select value={teamId} onChange={handleTeamChange} disabled={hasChangedTeam}>
                      {kboTeams.map(team => (
                        <option key={team.id} value={team.id}>{team.name}</option>
                      ))}
                    </select>
                    <p className="notice-text" style={{ color: '#d32f2f', margin: '6px 0 0 0', fontWeight: 500 }}>* 응원팀 변경은 1회만 가능합니다.</p>
                  </div>
                  <div>
                    <button className="save" onClick={handleSaveInfo}>저장</button>
                    <button className="cancel" onClick={() => setIsEditing(false)}>취소</button>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="mypage-card">
              <div className="mypage-subtab-buttons">
                <button className={`subtab ${subTab === 'posts' ? 'active' : ''}`} onClick={() => setSubTab('posts')}>내가 쓴 글</button>
                <button className={`subtab ${subTab === 'comments' ? 'active' : ''}`} onClick={() => setSubTab('comments')}>내가 쓴 댓글</button>
              </div>

              {subTab === 'posts' && (
                <ul className="mypage-post-list">
                  {myPosts.length === 0 ? <p>작성한 글이 없습니다.</p> :
                    myPosts.map(p => (
                      <li key={p.postId}>
                        {editPostId === p.postId ? (
                          <div className="mypage-post-content-box">
                            <input value={editPostTitle} onChange={e => setEditPostTitle(e.target.value)} />
                            <textarea value={editPostContent} onChange={e => setEditPostContent(e.target.value)} />
                            <div>
                              <button className="save" onClick={handleSavePost}>저장</button>
                              <button className="cancel" onClick={() => setEditPostId(null)}>취소</button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <strong>
                              <a href={`/board/${p.postId}`} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'underline' }}>
                                {p.postTitle}
                              </a>
                            </strong>
                            <div>{p.postContent}</div>
                            <div>작성일: {new Date(p.postCreatedAt).toLocaleString()}</div>
                          </>
                        )}
                      </li>
                    ))}
                </ul>
              )}

              {subTab === 'comments' && (
                <ul className="mypage-post-list">
                  {myComments.length === 0 ? <p>작성한 댓글이 없습니다.</p> :
                    myComments.map(c => {
                      const { link: boardLink, canMove, postIdUsed } = getBoardLink(c, myComments);
                      const isDeleted = postIdUsed && deletedPosts[postIdUsed];
                      return (
                        <li key={c.commentId}>
                          {editCommentId === c.commentId ? (
                            <div className="mypage-comment-edit-box">
                              <textarea value={editCommentContent} onChange={e => setEditCommentContent(e.target.value)} />
                              <div>
                                <button className="save" onClick={handleSaveComment}>저장</button>
                                <button className="cancel" onClick={() => setEditCommentId(null)}>취소</button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div
                                className="comment-content-link"
                                style={{ cursor: canMove && !isDeleted ? 'pointer' : 'not-allowed', textDecoration: canMove && !isDeleted ? 'underline' : 'none', color: canMove && !isDeleted ? '#1976d2' : '#aaa' }}
                                onClick={() => canMove && !isDeleted && window.open(boardLink, '_blank', 'noopener,noreferrer')}
                              >
                                {c.content}
                              </div>
                              <div>작성일: {new Date(c.createdAt).toLocaleString()}</div>
                              {!canMove && <div style={{ color: '#f00', fontSize: '0.9em' }}>* 게시글 정보가 없어 이동할 수 없습니다.</div>}
                              {isDeleted && <div style={{ color: '#f00', fontSize: '0.9em' }}>* 이미 삭제된 게시물입니다.</div>}
                            </>
                          )}
                        </li>
                      );
                    })}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPage;