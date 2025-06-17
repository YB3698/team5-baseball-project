import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup'; // 회원가입 컴포넌트
import Home from './pages/Home';     // 기존 테스트 화면

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
