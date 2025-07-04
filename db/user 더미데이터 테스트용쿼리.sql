-- 테스트용 user 더미데이터 생성
CREATE TABLE VOTE_OPTIONS (
  OPTION_ID NUMBER PRIMARY KEY,
  POLL_ID   NUMBER NOT NULL,
  DESCRIPTION VARCHAR2(100) NOT NULL,
  FOREIGN KEY (POLL_ID) REFERENCES POLLS(POLL_ID)
);

CREATE SEQUENCE SEQ_VOTE_OPTIONS
START WITH 1
INCREMENT BY 1
NOCACHE;

CREATE OR REPLACE TRIGGER TRG_VOTE_OPTIONS_ID
BEFORE INSERT ON VOTE_OPTIONS
FOR EACH ROW
BEGIN
  :NEW.OPTION_ID := SEQ_VOTE_OPTIONS.NEXTVAL;
END;

SELECT * FROM VOTE v ;
-- 기존 VOTE 테이블 삭제 (데이터 있으면 백업 후)
DROP TABLE VOTE CASCADE CONSTRAINTS;

-- 새로 생성: OPTION_ID 기준으로 투표
CREATE TABLE VOTE (
  VOTE_ID NUMBER PRIMARY KEY,
  USER_ID NUMBER NOT NULL,
  POLL_ID NUMBER NOT NULL,
  OPTION_ID NUMBER NOT NULL,
  VOTED_AT DATE DEFAULT SYSDATE,
  CONSTRAINT UQ_USER_POLL UNIQUE (USER_ID, POLL_ID),
  FOREIGN KEY (USER_ID) REFERENCES USERS(USER_ID),
  FOREIGN KEY (POLL_ID) REFERENCES POLLS(POLL_ID),
  FOREIGN KEY (OPTION_ID) REFERENCES VOTE_OPTIONS(OPTION_ID)
);

-- 시퀀스
CREATE SEQUENCE SEQ_VOTE
START WITH 1 INCREMENT BY 1 NOCACHE;

-- 트리거
CREATE OR REPLACE TRIGGER TRG_VOTE_ID
BEFORE INSERT ON VOTE
FOR EACH ROW
BEGIN
  :NEW.VOTE_ID := SEQ_VOTE.NEXTVAL;
END;

CREATE OR REPLACE TRIGGER trg_users_id
BEFORE INSERT ON USERS
FOR EACH ROW
BEGIN
  :NEW.USER_ID := seq_users.NEXTVAL;
END;