import React, { useState, useEffect } from 'react';
import './Comments.css';

const Comments = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState('');
  const [replyInput, setReplyInput] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);

  // 사용자 정보 가져오기
  let user = null;
  let userId = null;
  try {
    user = JSON.parse(localStorage.getItem('user'));
    userId = user?.userId || user?.user_id;
  } catch (e) {
    user = null;
    userId = null;
  }
  const isLoggedIn = !!userId;

  // 댓글 목록 불러오기
  useEffect(() => {
    if (!postId) return;
    fetch(`/api/comments?postId=${postId}`)
      .then(res => res.json())
      .then(data => setComments(data))
      .catch(() => setComments([]));
  }, [postId]);

  // 댓글 등록 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert('로그인 후에 댓글 작성이 가능합니다.');
      return;
    }
    if (!input.trim()) return;
    // 실제 등록 API 호출
    await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, content: input, userId })
    });
    setInput('');
    // 등록 후 목록 새로고침
    fetch(`/api/comments?postId=${postId}`)
      .then(res => res.json())
      .then(data => setComments(data));
  };

  // 대댓글 등록 핸들러
  const handleReplySubmit = async (e, commentId) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert('로그인 후에 댓글 작성이 가능합니다.');
      return;
    }
    if (!replyInput[commentId]?.trim()) return;
    await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, content: replyInput[commentId], parentId: commentId, userId })
    });
    setReplyInput({ ...replyInput, [commentId]: '' });
    setReplyingTo(null);
    fetch(`/api/comments?postId=${postId}`)
      .then(res => res.json())
      .then(data => setComments(data));
  };

  return (
    <div className="comment-section">
      <h4>댓글</h4>
      <ul className="comment-list">
        {comments.length === 0 ? (
          <li className="comment-item">아직 댓글이 없습니다.</li>
        ) : (
          comments.map((c) => (
            <li key={c.comment.commentId} className="comment-item">
              <div>
                <span className="comment-nickname">{c.comment.user?.nickname}</span>
                <span className="comment-content">{c.comment.content}</span>
              </div>
              {/* 대댓글 목록 */}
              {c.replies && c.replies.length > 0 && (
                <div className="reply-list">
                  {c.replies.map(r => (
                    <div key={r.commentId} className="reply-item">
                      <span className="reply-nickname">{r.user?.nickname}</span>
                      <span className="reply-content">{r.content}</span>
                    </div>
                  ))}
                </div>
              )}
              {/* 대댓글 입력창 토글 */}
              {replyingTo === c.comment.commentId ? (
                <form className="reply-form" onSubmit={e => handleReplySubmit(e, c.comment.commentId)}>
                  <input
                    type="text"
                    className="comment-input"
                    placeholder="대댓글을 입력하세요"
                    value={replyInput[c.comment.commentId] || ''}
                    onChange={e => setReplyInput({ ...replyInput, [c.comment.commentId]: e.target.value })}
                  />
                  <button type="submit" className="comment-submit">등록</button>
                </form>
              ) : (
                <button className="reply-btn" onClick={() => setReplyingTo(c.comment.commentId)}>답글</button>
              )}
            </li>
          ))
        )}
      </ul>
      {/* 댓글 입력 */}
      {isLoggedIn ? (
        <form className="comment-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="comment-input"
            placeholder="댓글을 입력하세요"
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <button type="submit" className="comment-submit">등록</button>
        </form>
      ) : (
        <div className="not-logged-in-comment">로그인 후 댓글 작성이 가능합니다.</div>
      )}
    </div>
  );
};

export default Comments;
