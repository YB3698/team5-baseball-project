import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>Spring Boot DB 연결 테스트</h1>
      <ul>
        <li>Spring 연결 성공</li>
      </ul>
      <Link to="/signup">회원가입 하러 가기</Link>
    </div>
  );
}

export default Home;
