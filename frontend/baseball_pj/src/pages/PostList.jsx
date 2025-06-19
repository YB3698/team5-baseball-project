import React, { useState, useEffect } from 'react';
import './Board.css';

const dummyPosts = [
  {
    post_id: 1,
    user_id: 100,
    user_nickname: '홍길동',
    post_title: 'KBO 리그 입찰 공고',
    post_content: 'KBO 리그 납품 공고입니다.',
    post_created_at: '2025-06-11T09:00:00',
    views: 376,
  },
  // 다른 더미 데이터 추가 가능
];

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    setPosts(dummyPosts); // 실제 서버 호출로 대체 예정
  }, []);

  const filteredPosts = posts.filter(post =>
    post.post_title.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <div className="board-container">
      <h2 className="board-title">공지사항</h2>
      <div className="board-search">
        <input
          type="text"
          placeholder="제목 검색"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <button>검색</button>
      </div>

      <table className="board-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>등록일</th>
            <th>조회수</th>
          </tr>
        </thead>
        <tbody>
          {filteredPosts.map((post, idx) => (
            <tr key={post.post_id}>
              <td>{post.post_id}</td>
              <td>{post.post_title}</td>
              <td>{post.user_nickname}</td>
              <td>{post.post_created_at.slice(0, 10)}</td>
              <td>{post.views || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PostList;