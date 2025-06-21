# crawl_team_rank.py

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
import pandas as pd
from datetime import datetime
import cx_Oracle

def crawl_team_rank():
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    driver.get("https://statiz.sporki.com/")

    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, ".table_type03"))
    )

    soup = BeautifulSoup(driver.page_source, 'html.parser')
    driver.quit()

    target_table = None
    for box in soup.select(".item_box"):
        title = box.select_one(".box_head")
        if title and "팀 순위" in title.text and "2025" in title.text:
            target_table = box.select_one("table")
            break

    if not target_table:
        print("❌ 팀 순위 테이블을 찾을 수 없습니다.")
        return

    data = []
    for row in target_table.select("tbody tr"):
        cols = row.find_all("td")
        if len(cols) < 10:
            continue
        try:
            team_name = cols[1].text.strip().replace('\xa0', ' ')
            games_played = int(float(cols[2].text.strip()))
            wins = int(float(cols[3].text.strip()))
            draws = int(float(cols[4].text.strip()))
            losses = int(float(cols[5].text.strip()))
            win_rate = float(cols[7].text.strip())
            runs_scored = int(float(cols[8].text.strip()))
            runs_allowed = int(float(cols[9].text.strip()))

            pyth_win_rate = round(runs_scored ** 2 / (runs_scored ** 2 + runs_allowed ** 2), 3)
            pyth_wins = round(pyth_win_rate * games_played, 1)

            data.append({
                "team_name": team_name,
                "games_played": games_played,
                "wins": wins,
                "draws": draws,
                "losses": losses,
                "win_rate": win_rate,
                "runs_scored": runs_scored,
                "runs_allowed": runs_allowed,
                "pyth_win_rate": pyth_win_rate,
                "pyth_wins": pyth_wins
            })
        except Exception as e:
            print(f"⚠️ 오류 발생: {e}")
            continue

    df = pd.DataFrame(data)
    df["pyth_rank"] = df["pyth_win_rate"].rank(ascending=False, method="min").astype(int)
    df["real_rank"] = df["win_rate"].rank(ascending=False, method="min").astype(int)
    df["rank_diff"] = df["real_rank"] - df["pyth_rank"]
    df["record_date"] = datetime.today().date()

    save_to_oracle(df)

def save_to_oracle(df):
    dsn = cx_Oracle.makedsn("210.119.14.76", 1521, service_name="XE") # 주소확인
    conn = cx_Oracle.connect(user="baseball", password="bb1234", dsn=dsn)    # id,pw 확인
    cursor = conn.cursor()

    insert_sql = """
        INSERT INTO TEAM_DAILY_RANKINGS (
            team_name, games_played, wins, draws, losses, win_rate,
            runs_scored, runs_allowed, pyth_win_rate, pyth_wins,
            pyth_rank, real_rank, rank_diff, record_date
        ) VALUES (
            :1, :2, :3, :4, :5, :6,
            :7, :8, :9, :10,
            :11, :12, :13, :14
        )
    """

    for _, row in df.iterrows():
        cursor.execute(insert_sql, (
            row['team_name'], row['games_played'], row['wins'], row['draws'], row['losses'], row['win_rate'],
            row['runs_scored'], row['runs_allowed'], row['pyth_win_rate'], row['pyth_wins'],
            row['pyth_rank'], row['real_rank'], row['rank_diff'], row['record_date']
        ))

    conn.commit()
    cursor.close()
    conn.close()
    print("✅ DB 저장 완료")

if __name__ == "__main__":
    crawl_team_rank()
