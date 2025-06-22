--  MVP : AI 수상 예측 그래프를 위한 테스트용 쿼리_JH
CREATE TABLE TEAM_DAILY_RANKINGS (
    id              NUMBER PRIMARY KEY,
    team_name       VARCHAR2(50) NOT NULL,
    games_played    NUMBER NOT NULL,            -- 경기수
    wins            NUMBER NOT NULL,            -- 승
    draws           NUMBER NOT NULL,            -- 무
    losses          NUMBER NOT NULL,            -- 패
    win_rate        FLOAT,                      -- 실제 승률
    runs_scored     NUMBER NOT NULL,            -- 득점
    runs_allowed    NUMBER NOT NULL,            -- 실점
    pyth_win_rate   FLOAT,                      -- 피타고리안 승률
    pyth_wins       FLOAT,                      -- 피타고리안 예상 승수
    pyth_rank       NUMBER,                     -- 피타고리안 순위
    real_rank       NUMBER,                     -- 실제 순위
    rank_diff       NUMBER,                     -- 순위 차이
    record_date     DATE DEFAULT SYSDATE        -- 기준일
);

CREATE SEQUENCE seq_team_rankings_id
START WITH 1
INCREMENT BY 1
NOCACHE;


CREATE OR REPLACE TRIGGER trg_team_rankings_id
BEFORE INSERT ON TEAM_DAILY_RANKINGS
FOR EACH ROW
BEGIN
  :NEW.id := seq_team_rankings_id.NEXTVAL;
END;

COMMIT;