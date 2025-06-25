import { useEffect, useState } from 'react';
import axios from 'axios';
import './Mypage.css';

const kboTeams = [
  { id: 1, name: 'NC 다이노스' },
  { id: 2, name: '로바이 자이언츠' },
  { id: 3, name: '삼성 라이온스' },
  { id: 4, name: 'KIA 타이거즈' },
  { id: 5, name: 'LG 트윈스' },
  { id: 6, name: '두산 베어스' },
  { id: 7, name: 'KT 위즈' },
  { id: 8, name: 'SSG 랜더스' },
  { id: 9, name: '한화 이그루스' },
  { id: 10, name: '키울 히어로즈' },
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
        .then(res => {
          const sorted = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setMyComments(sorted);
        });
    }
  }, []);

  const handleDeletePost = (postId) => {
    if (!window.confirm('정말로 삭제하시겠습니까?')) return;
    axios.delete(`/api/posts/${postId}`).then(() => {
      setMyPosts(myPosts.filter(p => p.postId !== postId));
    });
  };

  const handleStartEditPost = (post) => {
    setEditPostId(post.postId);
    setEditPostTitle(post.postTitle);
    setEditPostContent(post.postContent);
  };

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

  const handleDeleteComment = (commentId) => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return;
    axios.delete(`/api/comments/${commentId}`, {
      data: { userId: user.userId }
    }).then(() => {
      setMyComments(myComments.filter(c => c.commentId !== commentId));
    });
  };

  const handleStartEditComment = (comment) => {
    setEditCommentId(comment.commentId);
    setEditCommentContent(comment.content);
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
    axios.put(`/api/users/${user.userId}/update-info`, {
      nickname,
      email,
      teamId
    }).then(() => {
      const updatedUser = {
        ...user,
        nickname,
        email,
        teamId,
        hasChangedTeam: hasChangedTeam || teamId !== user.teamId
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setIsEditing(false);
      setHasChangedTeam(true);
      alert("정보가 수정되었습니다.");
    }).catch(() => {
      alert("수정에 실패했습니다.");
    });
  };

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
                    <input value={nickname} onChange={(e) => setNickname(e.target.value)} />
                  </div>
                  <div className="mypage-info-item">
                    <div className="mypage-info-label">이메일</div>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="mypage-info-item">
                    <div className="mypage-info-label">응원 팀</div>
                    <select value={teamId} onChange={handleTeamChange} disabled={hasChangedTeam}>
                      {kboTeams.map(team => (
                        <option key={team.id} value={team.id}>{team.name}</option>
                      ))}
                    </select>
                    {hasChangedTeam && <p className="notice-text">* 응원 팀은 한 번만 변경할 수 있습니다.</p>}
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
                            <strong>{p.postTitle}</strong>
                            <div>{p.postContent}</div>
                            <div>작성일: {new Date(p.postCreatedAt).toLocaleString()}</div>
                            <div>
                              <button className="edit" onClick={() => handleStartEditPost(p)}>수정</button>
                              <button className="delete" onClick={() => handleDeletePost(p.postId)}>삭제</button>
                            </div>
                          </>
                        )}
                      </li>
                    ))}
                </ul>
              )}

              {subTab === 'comments' && (
                <ul className="mypage-post-list">
                  {myComments.length === 0 ? <p>작성한 댓글이 없습니다.</p> :
                    myComments.map(c => (
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
                            <div>{c.content}</div>
                            <div>작성일: {new Date(c.createdAt).toLocaleString()}</div>
                            <div>
                              <button className="edit" onClick={() => handleStartEditComment(c)}>수정</button>
                              <button className="delete" onClick={() => handleDeleteComment(c.commentId)}>삭제</button>
                            </div>
                          </>
                        )}
                      </li>
                    ))}
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
