import React, { useState } from 'react';
import './Board.css';

const PostForm = ({ isEdit = false, initialData = {} }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  const [title, setTitle] = useState(initialData.post_title || '');
  const [content, setContent] = useState(initialData.post_content || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) return alert('로그인이 필요합니다.');
    const newPost = {
      user_id: user.user_id,
      user_nickname: user.nickname,
      post_title: title,
      post_content: content,
      post_created_at: new Date().toISOString(),
    };
    console.log('Submit:', newPost);
    alert(isEdit ? '수정 완료!' : '작성 완료!');
  };

  return (
    <div className="board-form-container">
      <h2 className="form-title">{isEdit ? '게시글 수정' : '게시글 작성'}</h2>
      <form className="post-form" onSubmit={handleSubmit}>
        <label>제목</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          required
        />

        <label>내용</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용을 작성하세요"
          rows={10}
          required
        ></textarea>

        <button type="submit">{isEdit ? '수정' : '작성'}하기</button>
      </form>
    </div>
  );
};

export default PostForm;