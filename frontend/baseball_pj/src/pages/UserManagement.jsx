import React, { useEffect, useState } from 'react';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filters, setFilters] = useState({ email: '', nickname: '', teamId: '', role: '' });

  // 더미 데이터로 초기화 (API 대체)
  useEffect(() => {
    const dummyData = [
      {
        id: 1,
        email: 'test1@example.com',
        nickname: '닉네임1',
        favoriteTeamId: 1,
        role: 'user',
        createdAt: '2024-06-20T12:00:00'
      },
      {
        id: 2,
        email: 'admin@example.com',
        nickname: '관리자',
        favoriteTeamId: 2,
        role: 'admin',
        createdAt: '2024-06-19T09:30:00'
      },
    ];
    setUsers(dummyData);
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const filteredUsers = users.filter(user => {
    return (
      user.email.includes(filters.email) &&
      user.nickname.includes(filters.nickname) &&
      String(user.favoriteTeamId).includes(filters.teamId) &&
      user.role.includes(filters.role)
    );
  });

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser({ ...selectedUser, [name]: value });
  };

  const handleSave = () => {
    if (!selectedUser) return;
    setUsers(users.map(u => u.id === selectedUser.id ? selectedUser : u));
    setSelectedUser(null);
  };

  const handleDelete = () => {
    if (!selectedUser) return;
    setUsers(users.filter(u => u.id !== selectedUser.id));
    setSelectedUser(null);
  };

  return (
    <div className="user-management-container">
      <h2 className="user-management-title">회원 관리</h2>

      {/* 필터 입력 */}
      <div className="filter-section">
        <input name="email" placeholder="이메일" value={filters.email} onChange={handleFilterChange} />
        <input name="nickname" placeholder="닉네임" value={filters.nickname} onChange={handleFilterChange} />
        <input name="teamId" placeholder="팀 ID" value={filters.teamId} onChange={handleFilterChange} />
        <input name="role" placeholder="권한" value={filters.role} onChange={handleFilterChange} />
        <button className="search-btn">검색</button>
      </div>

      {/* 수정 폼 */}
      {selectedUser && (
        <div className="user-edit-form">
          <h4>회원 수정</h4>
          <label>
            이메일: <input name="email" value={selectedUser.email} onChange={handleEditChange} />
          </label>
          <label>
            닉네임: <input name="nickname" value={selectedUser.nickname} onChange={handleEditChange} />
          </label>
          <label>
            팀 ID: <input name="favoriteTeamId" value={selectedUser.favoriteTeamId} onChange={handleEditChange} />
          </label>
          <label>
            권한: <input name="role" value={selectedUser.role} onChange={handleEditChange} />
          </label>
          <div className="edit-form-buttons">
            <button className="save-btn" onClick={handleSave}>저장</button>
            <button className="delete-btn" onClick={handleDelete}>삭제</button>
          </div>
        </div>
      )}

      {/* 회원 목록 */}
      <table className="user-management-table">
        <thead>
          <tr>
            <th>이메일</th>
            <th>닉네임</th>
            <th>팀 ID</th>
            <th>권한</th>
            <th>가입일</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.id} onDoubleClick={() => setSelectedUser(user)}>
              <td>{user.email}</td>
              <td>{user.nickname}</td>
              <td>{user.favoriteTeamId}</td>
              <td>{user.role}</td>
              <td>{user.createdAt?.split('T')[0]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
