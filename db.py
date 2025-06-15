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
    데이터베이스에서 모든 메뉴 항목을 가져오는 함수
    """
    conn = get_db_connection()
    cursor = conn.cursor()

    query = 'SELECT team_name, team_mascot, team_stadium, team_created_at FROM TEAMS'
    cursor.execute(query)

    menu_items = []
    for row in cursor:
        team_name, team_mascot, team_stadium, team_created_at = row
        menu_items.append({
            "team_name": team_name,
            "team_mascot": team_mascot,
            "team_stadium": team_stadium,
            "team_created_at": team_created_at
        })

    cursor.close()
    conn.close()
    return menu_items