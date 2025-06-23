import React, { useState } from 'react';
import UserManagement from './UserManagement';
import PollAdmin from './admin/PollAdmin';
import './Management.css';

const Management = () => {
  const [activeTab, setActiveTab] = useState('user');

  const renderContent = () => {
    switch (activeTab) {
      case 'user':
        return <UserManagement />;
      case 'vote':
        return <PollAdmin />;
      default:
        return null;
    }
  };

  return (
    <div className="management-container">
      <h2 className="management-title">관리자 페이지</h2>

    <div className="management-tabs">
      <button
        className={activeTab === 'user' ? 'active' : ''}
        onClick={() => setActiveTab('user')}
      >
        회원 관리
      </button>
      <button
        className={activeTab === 'user' ? 'active' : ''}
        onClick={() => setActiveTab('player')}
      >
        선수 관리
      </button>
      <button
        className={activeTab === 'vote' ? 'active' : ''}
        onClick={() => setActiveTab('vote')}
      >
        투표 관리
      </button>
    </div>
      <div className="management-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default Management;
