-- 1. TEAM 테이블 TEAM_CREATED_AT 컬럼 제약조건 NUMBER로 변경
-- 1-1 TEAM_CREATED_AT 제약조건명(SYS_C007346) 삭제
ALTER TABLE TEAMS
DROP CONSTRAINT SYS_C007346;

-- 1-2 TEAM_CREATED_AT 제약조건 NUMBER 추가
ALTER TABLE TEAMS
MODIFY TEAM_CREATED_AT NUMBER DEFAULT 0000; -- 제약조건은 하나씩밖에 추가 못함

-- 1-3 TEAM_CREATED_AT 제약조건 NOT NULL 추가
ALTER TABLE TEAMS
MODIFY TEAM_CREATED_AT NOT NULL;

COMMIT;

-- 2. TEAM 테이블 이상해서 데이터 다시 집어넣음
-- 2-1 TEAM 테이블 데이터 삭제
DELETE FROM TEAMS;
COMMIT;

-- 2-1 TEAM 테이블 값 쿼리로 INSERT
INSERT ALL
	INTO TEAMS VALUES (1, 'NC 다이노스', '다이노스(단디&쎄리)', '창원', 2011)
	INTO TEAMS VALUES (2, '롯데 자이언츠', '누리&아라&피니&원지', '부산', 1982)
	INTO TEAMS VALUES (3, '삼성 라이온즈', '블레오&핑크레오&레니&라온', '대구', 1982)
	INTO TEAMS VALUES (4, 'KIA 타이거즈', '호걸이&하랑이&호연이', '광주', 2001)
	INTO TEAMS VALUES (5, 'LG 트윈스', '럭키&스타', '서울', 1990)
	INTO TEAMS VALUES (6, '두산 베어스', '철웅이', '서울', 1982)
	INTO TEAMS VALUES (7, 'KT 위즈', '빅&또리', '수원', 2013)
	INTO TEAMS VALUES (8, 'SSG 랜더스', '랜디', '인천', 2021)
	INTO TEAMS VALUES (9, '한화 이글스', '비니&수리&후디&위니', '대전', 1986)
	INTO TEAMS VALUES (10, '키움 히어로즈', '동글이&턱돌이&돔돔이&슈퍼돔돔이', '서울', 2008)
	SELECT * FROM DUAL;

COMMIT;

-- 2-2 TEAM 테이블 '고양' 구단 추가
INSERT INTO TEAMS VALUES (11, '고양', '동글이&턱돌이&돔돔이&슈퍼돔돔이', '서울', 2008);

COMMIT;

-----------------------------------------------------------------------------------------------
-- 3. PLAYERS 테이블 컬럼 추가
ALTER TABLE PLAYERS ADD (
	PALYER_back_number     NUMBER,
	PALYER_birth_date      DATE,
	PALYER_height_weight   VARCHAR2(20),
	PALYER_education_path  VARCHAR2(200)
);

COMMIT;

-- 4. PLAYERS 테이블 데이터 이상하게 넣어져서 삭제하고 다시 넣기
DELETE PLAYERS;
COMMIT;

-- 5. 조인으로 TEAM_ID 잘 연결됐는지 확인
SELECT p.PLAYER_ID,
       p.PLAYER_NAME,
       p.PLAYER_POSITION,
       p.TEAM_ID,
       t.TEAM_NAME
 FROM PLAYERS p, TEAMS t
WHERE p.TEAM_ID = t.TEAM_ID;

---------------------------------------------------------------------------------------------------

-- 6. VOTE 테이블 컬럼 추가
ALTER TABLE VOTE ADD (VOTE_NAME VARCHAR2(255));
COMMIT;