
# 👥 팀프로젝트 1일차 : 프로젝트 초기 세팅

## 프로젝트명
**AI 기반 야구 통계 및 커뮤니티 플랫폼**

---

## 개발 기간
2025.06.13 ~ 2025.06.25

---

## 팀 구성
- 김정현
- 양은지
- 황혜미
- 박유빈

---

## Day 1 진행 내용 요약

| 항목 | 내용 |
|------|------|
| ✅ 프로젝트 목적 정의 | 실시간 경기 통계, AI 수상 예측, 팬 커뮤니티 게시판 통합 |
| ✅ 요구사항 정리 | 기능별 요구사항 작성 (SFR-100 ~ SFR-314) |
| ✅ 기술 스택 선정 | Python, Spring Boot, React, Oracle, Docker |
| ✅ GitHub 초기 세팅 | 공통 저장소 생성 및 브랜치 전략 논의 |

---

## 주요 결정사항

| 항목 | 내용 |
|------|------|
| 화면 구성 방향 | 메인페이지에 통계 시각화 + 페이지별 기능 구성 |
| 협업 도구 | GitHub + Google Sheets + KakaoTalk |

---

## 내일 목표 (Day 2)

- ✅ Spring Boot 프로젝트 생성 및 Oracle 연동 테스트
- ✅ React 프로젝트 기본 틀 구성 (`vite`, `axios`, `router` 등 설치)
- [ ] Python으로 OpenAPI 연결 테스트
- ✅ ERD 기반 테이블 생성 SQL 정리
- ✅ 초기 디렉토리 구성

# 👥 팀프로젝트 2일차 : 백엔드·프론트 기본 구성 및 API 준비

## Day 2 진행 내용 요약

| 항목 | 내용 |
|------|------|
| ✅ Spring Boot 프로젝트 세팅 완료 | `baseball_pj` 프로젝트 생성 및 `application.properties` 설정 |
| ✅ Oracle DB 연동 테스트 완료 | Docker 기반 Oracle XE 연결 확인, JPA 기반 DB 연동 정상 동작 확인 |
| ✅ React 프로젝트 구조 설정 | `vite` 기반 세팅 완료, `react-router-dom`, `axios` 적용 |
| ✅ GitHub 브랜치 전략 실행 | 각 팀원별 브랜치 및 PR 규칙 정립 |
| ✅ 초기 테이블 생성 SQL 작성 완료 | `USERS`, `TEAMS`, `POSTS` 등 핵심 테이블 작성 및 ERD 정리 완료 |

---

## 주요 작업 화면 예시

### 📁 Spring Boot 프로젝트 디렉토리 구조

```
com.baseball.baseball_pj
├── controller
├── repository
└── domain
```

### 🛠 Oracle 연동 테스트

```sql
SELECT * FROM USERS;
```

### 🖼 React 디렉토리 구조 예시

```
/src
├── pages
└── assets
```

---

## 🔧 문제 및 해결사항

| 문제 | 해결 방안 |
|------|-----------|
| Oracle timezone 오류 (`ORA-01882`) | `-Duser.timezone=Asia/Seoul` JVM 옵션 추가 및 Oracle JDBC 드라이버 최신화 |
| Hibernate Dialect 오류 | `OraclecDialect` 명시 및 Maven 의존성 재정비 |

---

## ✅ 내일 목표 (Day 3)

- ✅ React → Spring Boot 통신 테스트 (`/api/test` 등)
- ✅ 회원가입 백엔드/프론트 로직 구현 시작
- ✅ 사용할 데이터 크롤링


# 👥 팀프로젝트 3일차 : 프론트-백엔드 연동 및 크롤링 시작

## Day 3 진행 내용 요약

| 항목 | 내용 |
|------|------|
| ✅ React → Spring Boot 통신 테스트 | `/api/test` 엔드포인트를 통한 연동 성공 |
| ✅ 회원가입 기능 구현 시작 | 백엔드 `POST /signup` 구현 및 프론트 입력 폼 개발 완료 |
| ✅ 크롤링 데이터 수집 시작 | Python 기반 크롤러로 타자/투수 기록 및 경기일정 데이터 수집 완료 |
| ✅ 데이터 정제 방식 정리 | 크롤링한 CSV 데이터를 DB에 적재할 수 있도록 전처리 로직 설계 중 |

---

## 주요 작업 상세

### 📡 백엔드 연동 테스트
- Spring Boot → `@RestController` 작성 완료
- React에서 `axios.get('/api/test')`로 호출 후 결과 정상 출력

### 👤 회원가입 기능
- 입력 항목: 이메일, 비밀번호, 닉네임, 응원팀 선택
- Oracle 연동 후 `USERS` 테이블에 저장 확인
- 닉네임 중복 검사 기능은 추후 구현 예정

### 🧹 크롤링 데이터
- [x] 2002년 - 2025년 타자/투수 기록 수집 (KBO 기준)
- [x] KBO 경기 일정 페이지에서 날짜, 팀 정보 크롤링
- [ ] 경기 결과, MVP 등 추가 정보는 추후 구현 예정

---

## 사용 기술 및 도구

| 영역 | 기술 스택 |
|------|-----------|
| 백엔드 | Spring Boot, JPA, Oracle |
| 프론트엔드 | React, Vite, Axios |
| 데이터 수집 | Python, BeautifulSoup, pandas |
| 협업 도구 | GitHub, Notion, KakaoTalk, Google Sheets |

---

## ✅ 내일 목표 (Day 4)

- [ ] 로그인 기능 백엔드 및 프론트 구현
- [ ] 크롤링 데이터 DB 적재 및 API화
- [ ] 선수 기록 페이지 초기 UI 구성
- [ ] 관리자 페이지 라우팅 구조 설계

