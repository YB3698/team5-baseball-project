import React, { useEffect, useState } from 'react';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filters, setFilters] = useState({ email: '', nickname: '', favoriteTeamId: '', role: '' });

  // 회원 목록을 백엔드에서 받아옴
  useEffect(() => {
    fetch('/api/admin/users')
      .then(res => {
        console.log('status:', res.status);
        console.log('headers:', [...res.headers.entries()]);
        return res.text(); // 먼저 text로 받음
  })
  .then(text => {
    console.log('응답 본문:', text); // 여기가 핵심
    const data = JSON.parse(text || '[]'); // text가 없으면 빈 배열
    setUsers(Array.isArray(data) ? data : []);
  })
  .catch(err => console.error('회원 목록 로딩 실패:', err));

  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const filteredUsers = users.filter(user => {
    return (
      user.email.includes(filters.email) &&
      user.nickname.includes(filters.nickname) &&
      String(user.favoriteTeamId).includes(filters.favoriteTeamId) &&
      user.role.includes(filters.role)
    );
  });

  // 회원 정보 수정
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser({ ...selectedUser, [name]: value });
  };

  // 회원 정보 저장(수정)
  const handleSave = () => {
    if (!selectedUser) return;
    fetch(`/api/admin/users/${selectedUser.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(selectedUser)
    })
      .then(res => res.json())
      .then(data => {
        setUsers(users.map(u => u.id === data.id ? data : u));
        setSelectedUser(null);
      })
      .catch(err => alert('수정 실패: ' + err));
  };

  // 회원 삭제
  const handleDelete = () => {
    if (!selectedUser) return;
    fetch(`/api/admin/users/${selectedUser.id}`, { method: 'DELETE' })
      .then(() => {
        setUsers(users.filter(u => u.id !== selectedUser.id));
        setSelectedUser(null);
      })
      .catch(err => alert('삭제 실패: ' + err));
  };

  return (
    <div className="user-management-container">
      <h2 className="user-management-title">회원 관리</h2>
      <div className="filter-section">
        <input name="email" placeholder="이메일" value={filters.email} onChange={handleFilterChange} />
        <input name="nickname" placeholder="닉네임" value={filters.nickname} onChange={handleFilterChange} />
        <input name="favoriteTeamId" placeholder="팀 ID" value={filters.favoriteTeamId} onChange={handleFilterChange} />
        <input name="role" placeholder="권한" value={filters.role} onChange={handleFilterChange} />
        <button className="search-btn">검색</button>
      </div>
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
