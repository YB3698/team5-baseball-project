import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MyPage from './pages/Mypage';
import Home from './pages/Home';
import PlayerList from './pages/PlayerList';
import TeamList from './pages/TeamList';
import MatchSchedule from './pages/MatchSchedule';
import PlayerStats from './pages/PlayerStats';
import PostForm from './pages/PostForm';
import PostList from './pages/PostList';
import Management from './pages/Management';

function App() {
  const isLoggedIn = !!localStorage.getItem('user');

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/playerlist" element={<PlayerList />} />
        <Route path="/teamList" element={<TeamList />} />
        <Route path="/matchschedule" element={<MatchSchedule />} />
        <Route path="/playerstats" element={<PlayerStats />} />
        <Route path="/postform" element={<PostForm />} />
        <Route path="/postlist" element={<PostList />} />
        <Route path="/management" element={<Management />} /> 

        <Route
          path="/mypage"
          element={isLoggedIn ? <MyPage /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
