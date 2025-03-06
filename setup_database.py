import cx_Oracle
import os
import platform
from dotenv import load_dotenv

# Load .env file
load_dotenv()

# Set Oracle Client location based on environment
if platform.system() == "Windows":
    cx_Oracle.init_oracle_client(lib_dir=r"C:\instantclient_23_7")
elif platform.system() == "Linux":
    cx_Oracle.init_oracle_client(lib_dir="/opt/oracle/instantclient_23_7")
else:
    if "LD_LIBRARY_PATH" not in os.environ:
        raise EnvironmentError("Oracle Instant Client path not set for this OS")

# Database credentials from .env
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_DSN = os.getenv("DB_DSN")

# Connection pool
pool = None


def init_db_pool():
    global pool
    if pool is None:
        pool = cx_Oracle.SessionPool(
            user=DB_USER,
            password=DB_PASSWORD,
            dsn=DB_DSN,
            min=1,
            max=5,
            increment=1,
        )


def get_db_connection():
    init_db_pool()
    return pool.acquire()


SQL_FOLDER = os.path.join(os.path.dirname(__file__), "SQL")


def execute_sql_file(file_path):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        with open(file_path, "r") as file:
            sql_commands = file.read()
            cursor.execute(sql_commands)
        cursor.close()
        connection.commit()
        connection.close()
        print(f"{os.path.basename(file_path)} executed successfully.")

    except cx_Oracle.Error as error:
        print(f"Error executing {os.path.basename(file_path)}: {error}")


def run_sql_scripts():
    if not os.path.exists(SQL_FOLDER):
        print("SQL folder not found")
        return

    sql_files = sorted([f for f in os.listdir(SQL_FOLDER) if f.endswith(".sql")])

    if not sql_files:
        print("No SQL files found.")
        return
    for sql_file in sql_files:
        execute_sql_file(os.path.join(SQL_FOLDER, sql_file))

    print("Database setup complete")
