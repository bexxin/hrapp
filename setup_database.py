# setup_database.py
import cx_Oracle
import os
import platform
from dotenv import load_dotenv

load_dotenv()

if platform.system() == "Windows":
    # cx_Oracle.init_oracle_client(lib_dir=r"C:/instantclient_23_7/instantclient_23_7")
    cx_Oracle.init_oracle_client(lib_dir=r"C:\instantclient_23_7")
elif platform.system() == "Linux":
    cx_Oracle.init_oracle_client(lib_dir="/opt/oracle/instantclient_23_7")
else:
    if "LD_LIBRARY_PATH" not in os.environ:
        raise EnvironmentError("Oracle Instant Client path not set for this OS")

DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_DSN = os.getenv("DB_DSN")

pool = None


def init_db_pool():
    global pool
    if pool is None:
        print("Initializing database connection pool...")
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
    connection = get_db_connection()
    cursor = connection.cursor()
    try:
        print(f"Starting execution of: {file_path}")
        with open(file_path, "r") as file:
            sql_script = file.read()
            print(f"Script content: {sql_script}")
            statements = sql_script.split("/")
            for i, statement in enumerate(statements):
                statement = statement.strip()
                if statement:
                    print(f"Executing statement {i + 1}: {statement}")
                    cursor.execute(statement)
        connection.commit()
        print(f"{os.path.basename(file_path)} executed successfully.")
    except cx_Oracle.Error as error:
        print(f"Error executing {os.path.basename(file_path)}: {error}")
        raise  # Raise to see the error in the terminal
    except Exception as e:
        print(f"Unexpected error in {os.path.basename(file_path)}: {e}")
        raise
    finally:
        cursor.close()
        connection.close()


def run_sql_scripts():
    print(f"Starting run_sql_scripts with SQL_FOLDER: {SQL_FOLDER}")
    if not os.path.exists(SQL_FOLDER):
        print(f"SQL folder not found: {SQL_FOLDER}")
        return

    sql_files = sorted([f for f in os.listdir(SQL_FOLDER) if f.endswith(".sql")])
    print(f"Found SQL files: {sql_files}")

    if not sql_files:
        print("No SQL files found.")
        return

    for sql_file in sql_files:
        full_path = os.path.join(SQL_FOLDER, sql_file)
        print(f"Processing: {full_path}")
        execute_sql_file(full_path)

    print("Database setup complete")
