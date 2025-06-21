// Home 컴포넌트: 메인 페이지(홈) 역할, 추후 컨텐츠 추가 가능
import { Link } from 'react-router-dom';
import VoteGraph from "./VoteGraph";
import "./Home.css";

function Home() {
  return (
    <div>
      <h1>TEST HOMEPAGE</h1>
      <ul>
        {/* 추후 홈 컨텐츠 추가 */}
      </ul>
      {/* 오른쪽 하단에 실시간 투표현황 그래프 */}
      <VoteGraph />
    </div>
  );
}

export default Home;
