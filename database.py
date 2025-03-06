# database.py
import cx_Oracle
from setup_database import get_db_connection


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


def fetch_jobs():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        query = """
            SELECT *
            FROM HR_JOBS
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


def get_job_desc(job_id):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT get_job(:job_id) FROM dual", {"job_id": job_id})
        job_title = cursor.fetchone()[0]

        cursor.close()
        connection.close()

        return {"success": True, "job_title": job_title}

    except cx_Oracle.Error as error:
        print(f"Database error: {error}")
        return {"success": False, "error": str(error)}


def update_job_details(job_id, new_title=None, min_salary=None, max_salary=None):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.callproc("update_job_details_sp", [job_id, new_title, min_salary, max_salary])
        connection.commit()
        cursor.close()
        return {"success": True, "message": "Job details updated successfully."}
    except cx_Oracle.Error as error:
        print(f"Database error: {error}")
        return {"success": False, "error": str(error)}


def create_job(job_id, job_title, min_salary, max_salary):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.callproc("new_job", [job_id, job_title, min_salary, max_salary])
        connection.commit()
        cursor.close()
        connection.close()

        return {"success": True, "message": " New job added successfully."}
    except cx_Oracle.Error as error:
        print(f"Database error: {error}")
        return {"success": False, "error": str(error)}


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


def add_employee(first_name, last_name, email, phone, hire_date, job_id, salary, manager_id, department_id):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.callproc(
            "employee_hire_sp",
            [first_name, last_name, email, phone, hire_date, job_id, salary, manager_id, department_id],
        )
        connection.commit()
        cursor.close()
        connection.close()
        return {"success": True, "message": "Employee hired successfully."}
    except cx_Oracle.Error as error:
        print(f"Database error: {error}")
        return {"success": False, "error": str(error)}
