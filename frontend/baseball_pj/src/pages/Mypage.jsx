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
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [teamId, setTeamId] = useState(1);
  const [myPosts, setMyPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setNickname(parsed.nickname);
      setEmail(parsed.email);
      setTeamId(parsed.teamId);

      axios.get('/api/posts')
        .then(res => {
          const filtered = res.data.filter(p => p.userId === parsed.userId);
          setMyPosts(filtered);
        })
        .catch(console.error);
    }
  }, []);

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setEditMode(false);
    setEditTitle(post.postTitle);
    setEditContent(post.postContent);
  };

  const handleBackToList = () => {
    setSelectedPost(null);
    setEditMode(false);
  };

  const handleDeletePost = () => {
    if (window.confirm('정말로 이 글을 삭제하시겠습니까?')) {
      axios.delete(`/api/posts/${selectedPost.postId}`)
        .then(() => {
          setMyPosts(myPosts.filter(p => p.postId !== selectedPost.postId));
          setSelectedPost(null);
          alert('삭제되었습니다.');
        })
        .catch(console.error);
    }
  };

  const handleSaveEdit = () => {
    const updated = {
      ...selectedPost,
      postTitle: editTitle,
      postContent: editContent,
    };

    axios.put(`/api/posts/${selectedPost.postId}`, updated)
      .then(res => {
        const updatedList = myPosts.map(p =>
          p.postId === selectedPost.postId ? res.data : p
        );
        setMyPosts(updatedList);
        setSelectedPost(res.data);
        setEditMode(false);
        alert('수정되었습니다.');
      })
      .catch(console.error);
  };

  if (!user) return null;

  return (
    <div className="mypage-container">
      <h2 className="mypage-title">마이페이지</h2>
      <hr className="mypage-divider" />
      <div className="mypage-layout">
        <div className="mypage-sidebar">
          <button className={`mypage-tab ${activeTab === 'info' ? 'active' : ''}`} onClick={() => setActiveTab('info')}>정보확인</button>
          <button className={`mypage-tab ${activeTab === 'posts' ? 'active' : ''}`} onClick={() => setActiveTab('posts')}>내 활동</button>
        </div>

        <div className="mypage-content">
          {activeTab === 'info' && (
            <div className="mypage-card">
              <div className="mypage-info-item">
                <div className="mypage-info-label">닉네임</div>
                <div className="mypage-info-value boxed">{nickname}</div>
              </div>
              <div className="mypage-info-item">
                <div className="mypage-info-label">이메일</div>
                <div className="mypage-info-value boxed">{email}</div>
              </div>
              <div className="mypage-info-item">
                <div className="mypage-info-label">응원 팀</div>
                <div className="mypage-info-value boxed">
                  {kboTeams.find(team => team.id === teamId)?.name || '-'}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'posts' && (
            <div className="mypage-card">
              {selectedPost ? (
                <div className="mypage-post-detail">
                  <button onClick={handleBackToList} className="mypage-back">← 뒤로가기</button>

                  {editMode ? (
                    <>
                      <input
                        value={editTitle}
                        onChange={e => setEditTitle(e.target.value)}
                        className="mypage-input"
                      />
                      <textarea
                        value={editContent}
                        onChange={e => setEditContent(e.target.value)}
                        className="mypage-textarea"
                      />
                      <div className="mypage-post-actions">
                        <button className="edit" onClick={handleSaveEdit}>저장</button>
                        <button className="delete" onClick={() => setEditMode(false)}>취소</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="mypage-post-title">{selectedPost.postTitle}</h3>
                      <p className="mypage-post-content boxed">{selectedPost.postContent}</p>
                      <p className="mypage-post-date">작성일: {new Date(selectedPost.postCreatedAt).toLocaleDateString()}</p>
                      <div className="mypage-post-actions">
                        <button className="edit" onClick={() => setEditMode(true)}>수정</button>
                        <button className="delete" onClick={handleDeletePost}>삭제</button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <>
                  <h3 className="mypage-subtitle">내가 쓴 글</h3>
                  {myPosts.length === 0 ? (
                    <p>작성한 글이 없습니다.</p>
                  ) : (
                    <ul className="mypage-post-list">
                      {myPosts.map(post => (
                        <li key={post.postId} onClick={() => handlePostClick(post)}>
                          <strong>{post.postTitle}</strong>
                          <div>{new Date(post.postCreatedAt).toLocaleString()}</div>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPage;
