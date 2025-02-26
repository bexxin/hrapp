# database.py
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


def fetch_employees():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        query = """
            SELECT e.EMPLOYEE_ID as ID, e.FIRST_NAME as "FIRST NAME", e.LAST_NAME as "LAST NAME", e.EMAIL,
                    e.PHONE_NUMBER, e.HIRE_DATE, e.JOB_ID, e.SALARY,
                    e.COMMISSION_PCT, e.MANAGER_ID, e.DEPARTMENT_ID
            FROM HR_EMPLOYEES e
        """
        cursor.execute(query)
        table_data = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]
        cursor.close()
        connection.close()
        return table_data, column_names, None  # Success: error is None
    except cx_Oracle.Error as error:
        print(f"Database error: {error}")
        return (
            [],
            [],
            str(error),
        )


def fetch_departments():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        query = """
            SELECT *
            FROM HR_DEPARTMENTS
        """
        cursor.execute(query)
        table_data = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]
        cursor.close()
        connection.close()
        return table_data, column_names, None  # Success: error is None
    except cx_Oracle.Error as error:
        print(f"Database error: {error}")
        return (
            [],
            [],
            str(error),
        )


def fetch_manage_employees():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        query = """
            SELECT
                e.employee_id AS id,
                e.first_name  AS "FIRST NAME",
                e.last_name   AS "LAST NAME",
                e.email,
                e.phone_number,
                e.hire_date,
                e.job_id,
                e.salary,
                e.commission_pct,
                e.manager_id,
                e.department_id,
                j.job_title,
                d.department_name
            FROM
                    hr_employees e
                JOIN hr_jobs        j ON j.job_id = e.job_id
                JOIN hr_departments d ON d.department_id = e.department_id
        """
        cursor.execute(query)
        table_data = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]
        cursor.close()
        connection.close()
        return table_data, column_names, None  # Success: error is None
    except cx_Oracle.Error as error:
        print(f"Database error: {error}")
        return (
            [],
            [],
            str(error),
        )
