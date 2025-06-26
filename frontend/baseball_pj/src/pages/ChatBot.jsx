// src/components/ChatBot.jsx
import axios from 'axios';
import { useState, useRef, useEffect } from 'react';
import './ChatBot.css';

function ChatBot() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]); // {role: 'user'|'bot', text: string}
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

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
    <div className="chatbot-ui">
      <div className="chatbot-messages">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`chatbot-message ${msg.role}`}
          >
            <span className="chatbot-message-text">{msg.text}</span>
          </div>
        ))}
        {loading && <div className="chatbot-loading">AI가 답변 중...</div>}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="chatbot-form">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="메시지를 입력하세요..."
          className="chatbot-input"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="chatbot-send-btn"
        >
          전송
        </button>
      </form>
    </div>
  );
}

export default ChatBot;
