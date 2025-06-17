import cx_Oracle as oci

# DB 연결 설정 변수
sid = 'XE'
host = '210.119.14.76'
port = 1521
username = 'baseball'
password = 'bb1234'

def get_db_connection():
    """
    데이터베이스 연결을 생성하는 함수
    """
    conn = oci.connect(f'{username}/{password}@{host}:{port}/{sid}')
    return conn

def fetch_teams():
    """
    데이터베이스에서 테이블 항목을 가져오는 함수
    """
    conn = get_db_connection()
    cursor = conn.cursor()

    query = 'SELECT team_name, team_mascot, team_stadium, team_created_at FROM TEAMS'
    cursor.execute(query)

    baseball = []
    for row in cursor:
        team_name, team_mascot, team_stadium, team_created_at = row
        baseball.append({
            "team_name": team_name,
            "team_mascot": team_mascot,
            "team_stadium": team_stadium,
            "team_created_at": team_created_at
        })

    cursor.close()
    conn.close()
    return baseball

if __name__ == '__main__':
    teams = fetch_teams()
    if not teams:
        print("No data found in TEAMS table.")
    else:
        for team in teams:
            print(team)