import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const PostDetail = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`/api/posts/${postId}`)
      .then(res => {
        setPost(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('게시글을 불러올 수 없습니다.');
        setLoading(false);
      });
  }, [postId]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;
  if (!post) return <div>게시글이 없습니다.</div>;

  return (
    <div style={{ padding: 24 }}>
      <h2>{post.postTitle}</h2>
      <div style={{ margin: '16px 0' }}>{post.postContent}</div>
      <div>작성일: {new Date(post.postCreatedAt).toLocaleString()}</div>
      <div>작성자: {post.nickname || post.userId}</div>
    </div>
  );
};

export default PostDetail;
