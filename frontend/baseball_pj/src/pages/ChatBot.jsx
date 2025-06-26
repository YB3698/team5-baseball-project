// src/components/ChatBot.jsx
import { useState } from 'react';
import axios from 'axios';

function ChatBot() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]); // {role: 'user'|'bot', text: string}
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { role: 'user', text: input };
    setMessages(msgs => [...msgs, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await axios.post('/api/chatbot', { message: userMsg.text });
      setMessages(msgs => [...msgs, { role: 'bot', text: res.data.reply }]);
    } catch (err) {
      setMessages(msgs => [...msgs, { role: 'bot', text: '서버 오류가 발생했습니다.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-ui" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="chatbot-messages" style={{ flex: 1, overflowY: 'auto', padding: 8, marginBottom: 8 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            textAlign: msg.role === 'user' ? 'right' : 'left',
            margin: '8px 0',
            color: msg.role === 'user' ? '#2563eb' : '#222'
          }}>
            <span style={{
              display: 'inline-block',
              background: msg.role === 'user' ? '#e6f0ff' : '#f3f3f3',
              borderRadius: 12,
              padding: '8px 14px',
              maxWidth: 220,
              wordBreak: 'break-all',
              fontSize: 15
            }}>{msg.text}</span>
          </div>
        ))}
        {loading && <div style={{ color: '#888', fontSize: 14 }}>AI가 답변 중...</div>}
      </div>
      <form onSubmit={sendMessage} style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="메시지를 입력하세요..."
          style={{ flex: 1, borderRadius: 8, border: '1px solid #bbb', padding: '8px 12px', fontSize: 15 }}
          disabled={loading}
        />
        <button type="submit" disabled={loading || !input.trim()} style={{ borderRadius: 8, background: '#2563eb', color: '#fff', border: 'none', padding: '0 18px', fontWeight: 600, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer' }}>
          전송
        </button>
      </form>
    </div>
  );
}

export default ChatBot;
