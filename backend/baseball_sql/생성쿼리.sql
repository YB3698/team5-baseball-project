CREATE TABLE teams (
  team_id        NUMBER PRIMARY KEY,
  team_name      VARCHAR2(50) NOT NULL,
  team_mascot    VARCHAR2(100) NOT NULL,
  team_stadium   VARCHAR2(100) NOT NULL,
  team_created_at DATE DEFAULT SYSDATE NOT NULL -- 현재날짜와 시간 자동으로 날짜 형태로 저장
);
CREATE TABLE users (
  user_id         NUMBER PRIMARY KEY,
  user_email      VARCHAR2(100) NOT NULL,
  user_password   VARCHAR2(100) NOT NULL,
  user_nickname   VARCHAR2(50) NOT NULL,
  team_id         NUMBER NOT NULL,
  user_role       VARCHAR2(20) NOT NULL,
  user_created_at DATE DEFAULT SYSDATE NOT NULL,
  FOREIGN KEY (team_id) REFERENCES teams(team_id)
);
CREATE TABLE posts (
  post_id       NUMBER PRIMARY KEY,
  user_id       NUMBER NOT NULL,
  team_id       NUMBER NOT NULL,
  post_title    VARCHAR2(100) NOT NULL,
  post_content  CLOB NOT NULL,  -- 문자형 대용량 객체
  post_created_at DATE DEFAULT SYSDATE NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (team_id) REFERENCES teams(team_id)
);
CREATE TABLE comments (
  comment_id       NUMBER PRIMARY KEY,
  post_id          NUMBER NOT NULL,
  user_id          NUMBER NOT NULL,
  comment_content  CLOB NOT NULL,
  comment_created_at DATE DEFAULT SYSDATE NOT NULL,
  FOREIGN KEY (post_id) REFERENCES posts(post_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);
CREATE TABLE players (
  player_id       NUMBER PRIMARY KEY,
  player_name     VARCHAR2(50) NOT NULL,
  player_position VARCHAR2(20) NOT NULL,
  team_id         NUMBER NOT NULL,
  FOREIGN KEY (team_id) REFERENCES teams(team_id)
);
CREATE TABLE hitter_stats (
  hitter_stats_id NUMBER PRIMARY KEY,
  player_id       NUMBER NOT NULL,
  team_id         NUMBER NOT NULL,
  hitter_stats_year NUMBER,  -- 시즌 연도(정수4자리)만 따옴
  hitter_stats_ab NUMBER,
  hitter_stats_hits NUMBER,
  hitter_stats_2b NUMBER,
  hitter_stats_3b NUMBER,
  hitter_stats_hr NUMBER,
  hitter_stats_bb NUMBER,
  hitter_stats_hbp NUMBER,
  hitter_stats_so NUMBER,
  hitter_stats_sb NUMBER,
  hitter_stats_cs NUMBER,
  hitter_stats_gidp NUMBER,
  hitter_stats_avg NUMBER(4,3),  -- 정수 4자리 중 소수 3자리(9.999)
  hitter_stats_ops NUMBER(4,3),
  hitter_stats_woba NUMBER(4,2),
  hitter_stats_wrc_plus NUMBER,
  hitter_stats_war NUMBER(4,2),
  FOREIGN KEY (player_id) REFERENCES players(player_id),
  FOREIGN KEY (team_id) REFERENCES teams(team_id)
);
CREATE TABLE pitcher_stats (
  pitcher_stats_id NUMBER PRIMARY KEY,
  player_id         NUMBER NOT NULL,
  team_id           NUMBER NOT NULL,
  pitcher_stats_year NUMBER NOT NULL,
  pitcher_stats_games NUMBER,
  pitcher_stats_innings NUMBER(4,2),
  pitcher_stats_wins NUMBER,
  pitcher_stats_losses NUMBER,
  pitcher_stats_saves NUMBER,
  pitcher_stats_holds NUMBER,
  pitcher_stats_so NUMBER,
  pitcher_stats_bb NUMBER,
  pitcher_stats_hits NUMBER,
  pitcher_stats_hr NUMBER,
  pitcher_stats_hbp NUMBER,
  pitcher_stats_era NUMBER(4,2),
  pitcher_stats_whip NUMBER(4,2),
  pitcher_stats_fip NUMBER(4,2),
  pitcher_stats_war NUMBER(4,2),
  pitcher_stats_wpa NUMBER(4,3),
  FOREIGN KEY (player_id) REFERENCES players(player_id),
  FOREIGN KEY (team_id) REFERENCES teams(team_id)
);
CREATE TABLE games (
  game_id       NUMBER PRIMARY KEY,
  game_date     DATE NOT NULL,
  game_time     DATE NOT NULL,
  home_team_id  NUMBER NOT NULL,
  away_team_id  NUMBER NOT NULL,
  stadium       VARCHAR2(100) NOT NULL,
  status        VARCHAR2(20) NOT NULL,
  home_score    NUMBER,
  away_score    NUMBER,
  game_duration DATE,
  is_rainout    CHAR(1) CHECK (is_rainout IN ('Y', 'N')),  -- Y, N 문자 한글자만 입력 가능.
  game_type     VARCHAR2(20),
  FOREIGN KEY (home_team_id) REFERENCES teams(team_id),
  FOREIGN KEY (away_team_id) REFERENCES teams(team_id)
);
CREATE TABLE polls (
  poll_id     NUMBER PRIMARY KEY,
  poll_title  VARCHAR2(100) NOT NULL,
  start_date  DATE,
  end_date    DATE,
  is_active   CHAR(1) DEFAULT 'Y' CHECK (is_active IN ('Y','N'))
);
CREATE TABLE vote (
  vote_id     NUMBER PRIMARY KEY,
  user_id     NUMBER NOT NULL,
  player_id   NUMBER NOT NULL,
  poll_id     NUMBER NOT NULL,
  voted_at    DATE DEFAULT SYSDATE NOT NULL, -- 날짜 시간 저장. 입력 안하면 자동으로 현재 날짜 시간 저장
  CONSTRAINT uq_user_poll UNIQUE (user_id, poll_id), -- user_id랑 poll_id 중복되지 않게 제한하는 제약조건명
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (player_id) REFERENCES players(player_id),
  FOREIGN KEY (poll_id) REFERENCES polls(poll_id)
);

