import React, { useEffect, useState, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import './Talk.css';

const ChatRoom = () => {
  const [client, setClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [connected, setConnected] = useState(false);
  const [open, setOpen] = useState(true);
  const messagesEndRef = useRef(null);

  // 로그인 유저 정보
  const user = JSON.parse(localStorage.getItem('user'));
  const nickname = user?.nickname || '';

  useEffect(() => {
    if (!nickname) return; // 로그인 안 했으면 연결 X
    const sock = new SockJS('http://bjava.iptime.org:8895/ws');
    const stomp = new Client({
      webSocketFactory: () => sock,
      reconnectDelay: 3000,
      onConnect: () => {
        setConnected(true);
        stomp.subscribe('/topic/public', (message) => {
          const data = JSON.parse(message.body);
          setMessages(prev => [...prev, data]);
        });
      },
      onDisconnect: () => setConnected(false),
      onStompError: () => setConnected(false)
    });
    stomp.activate();
    setClient(stomp);
    return () => stomp.deactivate();
  }, [nickname]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // 메시지 히스토리: 로그인 상태에서만 유지, 로그아웃 시 초기화
  useEffect(() => {
    if (nickname) {
      const saved = localStorage.getItem('chatMessages');
      if (saved) setMessages(JSON.parse(saved));
    } else {
      setMessages([]);
      localStorage.removeItem('chatMessages');
    }
  }, [nickname]);

  useEffect(() => {
    if (nickname) {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    }
  }, [messages, nickname]);

  const sendMessage = () => {
    if (client && input.trim() !== '' && connected && nickname) {
      client.publish({
        destination: '/app/chat.send',
        body: JSON.stringify({
          sender: nickname,
          content: input
        })
      });
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  if (!nickname) {
    return (
      <div className="talk-fixed-container">
        <div className="talk-chatbox talk-chatbox-locked">
          <h3>실시간 채팅</h3>
          <div className="talk-locked-msg">로그인한 사용자만 실시간 채팅을 이용할 수 있습니다.</div>
        </div>
      </div>
    );
  }

  if (!open) {
    return (
      <div className="talk-toggle-btn" onClick={() => setOpen(true)} title="채팅 열기">
        💬
      </div>
    );
  }

  return (
    <div className="talk-fixed-container">
      <div className="talk-chatbox talk-chatbox-large">
        <div className="talk-chatbox-header">
          <h3 style={{ margin: 0, fontWeight: 600 }}>실시간 채팅</h3>
          <button className="talk-close-btn" onClick={() => setOpen(false)} title="채팅 닫기">×</button>
        </div>
        <ul className="talk-messages talk-messages-large">
          {messages.map((msg, idx) => (
            <li
              key={idx}
              className={msg.sender === nickname ? 'talk-message-me' : 'talk-message-other'}
            >
              {msg.sender === nickname ? (
                <>{msg.content}</>
              ) : (
                <><b>{msg.sender}</b>: {msg.content}</>
              )}
            </li>
          ))}
          <div ref={messagesEndRef} />
        </ul>
        <div className="talk-input-row">
          <input
            className="talk-input talk-input-large"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="메시지를 입력하세요"
            disabled={!connected}
          />
          <button className="talk-send-btn talk-send-btn-large" onClick={sendMessage} disabled={!connected || input.trim() === ''}>전송</button>
        </div>
        <div className="talk-status">
          {connected ? '채팅 서버 연결됨' : '서버 연결 중...'}
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
