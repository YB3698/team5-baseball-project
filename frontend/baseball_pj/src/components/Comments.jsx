import React, { useState, useEffect } from 'react';
import './Comments.css';

const Comments = ({ postId }) => {
  // 댓글 목록 상태
  const [comments, setComments] = useState([]);
  // 댓글 입력창 상태
  const [input, setInput] = useState('');
  // 대댓글 입력창 상태 (댓글별로 관리)
  const [replyInput, setReplyInput] = useState({});
  // 현재 대댓글 입력창이 열려있는 댓글 id
  const [replyingTo, setReplyingTo] = useState(null);
  // 현재 수정 중인 댓글/대댓글 id
  const [editingCommentId, setEditingCommentId] = useState(null);
  // 수정 입력값 상태
  const [editInput, setEditInput] = useState('');
  // 대댓글 펼치기/접기 상태 (댓글별로 관리)
  const [replyOpen, setReplyOpen] = useState({});
  // 페이지네이션 대신 보여줄 댓글 개수 상태
  const ITEMS_PER_PAGE = 5;
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // 사용자 정보(localStorage에서 가져옴)
  let user = null;
  let userId = null;
  try {
    user = JSON.parse(localStorage.getItem('user'));
    // userId는 user.userId 또는 user.user_id로 저장될 수 있음
    userId = user?.userId || user?.user_id;
  } catch (e) {
    user = null;
    userId = null;
  }
  // 로그인 여부
  const isLoggedIn = !!userId;

  // 댓글 목록 불러오기 (postId 변경 시마다)
  useEffect(() => {
    if (!postId) return;
    fetch(`/api/comments?postId=${postId}`)
      .then(res => res.json())
      .then(data => {
        setComments(data || []);
        setVisibleCount(ITEMS_PER_PAGE); // postId 바뀔 때만 초기화
      })
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
    // 댓글 등록 API 호출
    await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, content: input, userId })
    });
    setInput('');
    // 등록 후 목록 새로고침 (visibleCount는 초기화하지 않음)
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
    // 대댓글 등록 API 호출
    await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, content: replyInput[commentId], parentId: commentId, userId })
    });
    setReplyInput({ ...replyInput, [commentId]: '' });
    setReplyingTo(null);
    // 등록 후 목록 새로고침 (visibleCount는 초기화하지 않음)
    fetch(`/api/comments?postId=${postId}`)
      .then(res => res.json())
      .then(data => setComments(data));
  };

  // 댓글/대댓글 수정 버튼 클릭 시
  const handleEdit = (commentId, content) => {
    setEditingCommentId(commentId); // 수정할 댓글/대댓글 id 저장
    setEditInput(content); // 기존 내용 입력창에 세팅
  };

  // 댓글/대댓글 수정 제출 핸들러
  const handleEditSubmit = async (e, commentId, parentId) => {
    e.preventDefault();
    if (!editInput.trim()) return;
    // 수정 API 호출 (userId 반드시 포함)
    await fetch(`/api/comments/${commentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: editInput, parentId, userId })
    });
    setEditingCommentId(null);
    setEditInput('');
    // 수정 후 목록 새로고침
    fetch(`/api/comments?postId=${postId}`)
      .then(res => res.json())
      .then(data => setComments(data));
  };

  // 댓글/대댓글 삭제 핸들러
  const handleDelete = async (commentId) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    // 삭제 API 호출 (userId 반드시 포함)
    await fetch(`/api/comments/${commentId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    // 삭제 후 목록 새로고침
    fetch(`/api/comments?postId=${postId}`)
      .then(res => res.json())
      .then(data => setComments(data));
  };

  return (
    <div className="comment-section">
      <h4>댓글</h4>
      <ul className="comment-list">
        {console.log('comments.length:', comments.length, 'visibleCount:', visibleCount)}
        {/* 댓글이 없을 때 */}
        {comments.length === 0 ? (
          <li className="comment-item">아직 댓글이 없습니다.</li>
        ) : (
          comments.slice(0, visibleCount).map((c) => (
            <li key={c.comment.commentId} className="comment-item">
              {/* 댓글 닉네임/내용 세로 정렬 */}
              <div className="comment-main">
                <span className="comment-nickname">{c.comment.user?.nickname}</span>
                {/* 댓글 수정 중이면 입력창, 아니면 내용 */}
                {editingCommentId === c.comment.commentId ? (
                  <form className="edit-form" onSubmit={e => handleEditSubmit(e, c.comment.commentId, null)}>
                    <input
                      type="text"
                      className="comment-input"
                      value={editInput}
                      onChange={e => setEditInput(e.target.value)}
                    />
                    <button type="submit" className="comment-submit">저장</button>
                    <button type="button" onClick={() => setEditingCommentId(null)}>취소</button>
                  </form>
                ) : (
                  <span className="comment-content">{c.comment.content}</span>
                )}
              </div>
              {/* 본인 댓글만 수정/삭제 텍스트 링크 노출 */}
              {isLoggedIn && String(userId) === String(c.comment.user?.id) && editingCommentId !== c.comment.commentId && (
                <span className="reply-action-links">
                  <span className="reply-edit-link" onClick={() => handleEdit(c.comment.commentId, c.comment.content)}>수정</span>
                  <span className="reply-delete-link" onClick={() => handleDelete(c.comment.commentId)}>삭제</span>
                </span>
              )}
              {/* 답글 펼치기/접기, 댓글 쓰기 텍스트링크 */}
              <div className="reply-link-wrap">
                <div className="reply-link-row">
                  {/* 대댓글이 있을 때만 펼치기/접기 노출 */}
                  {c.replies && c.replies.length > 0 && (
                    <span
                      className="reply-toggle-link"
                      onClick={() => setReplyOpen(prev => ({
                        ...prev,
                        [c.comment.commentId]: !prev[c.comment.commentId]
                      }))}
                    >
                      {replyOpen[c.comment.commentId] ? '접기' : `댓글(${c.replies.length})`}
                    </span>
                  )}
                  {/* 대댓글 입력창 토글 */}
                  <span
                    className="reply-link"
                    onClick={() => {
                      if (replyingTo === c.comment.commentId) {
                        setReplyingTo(null);
                        setReplyInput(prev => ({ ...prev, [c.comment.commentId]: '' }));
                      } else {
                        setReplyingTo(c.comment.commentId);
                      }
                    }}
                  >댓글 쓰기</span>
                </div>
                {/* 대댓글 입력창 (토글) */}
                {replyingTo === c.comment.commentId && (
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
                )}
              </div>
              {/* 대댓글 목록 (펼치기 상태일 때만) */}
              {c.replies && c.replies.length > 0 && replyOpen[c.comment.commentId] && (
                <div className="reply-list">
                  {c.replies.map(r => (
                    <div key={r.commentId} className="reply-item">
                      <span className="reply-nickname">{r.user?.nickname}</span>
                      {/* 대댓글 수정 중이면 입력창, 아니면 내용 */}
                      {editingCommentId === r.commentId ? (
                        <form className="edit-form" onSubmit={e => handleEditSubmit(e, r.commentId, c.comment.commentId)}>
                          <input
                            type="text"
                            className="comment-input"
                            value={editInput}
                            onChange={e => setEditInput(e.target.value)}
                          />
                          <button type="submit" className="comment-submit">저장</button>
                          <button type="button" onClick={() => setEditingCommentId(null)}>취소</button>
                        </form>
                      ) : (
                        <span className="reply-content">{r.content}</span>
                      )}
                      {/* 본인 대댓글만 수정/삭제 텍스트 링크 노출 */}
                      {isLoggedIn && String(userId) === String(r.user?.id) && editingCommentId !== r.commentId && (
                        <span className="reply-action-links">
                          <span className="reply-edit-link" onClick={() => handleEdit(r.commentId, r.content)}>수정</span>
                          <span className="reply-delete-link" onClick={() => handleDelete(r.commentId)}>삭제</span>
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </li>
          ))
        )}
      </ul>
      {/* 더보기 버튼 */}
      {Array.isArray(comments) && comments.length > 0 && comments.length > visibleCount && (
        <div className="more-btn-wrap">
          <button type="button" className="more-btn" onClick={() => setVisibleCount(v => v + ITEMS_PER_PAGE)}>
            더보기
          </button>
        </div>
      )}
      {/* 댓글 입력창 (로그인 시만) */}
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