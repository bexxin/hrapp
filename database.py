# database.py
import cx_Oracle
from setup_database import get_db_connection


def get_user_credentials(username):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        query = "SELECT user_id, username, email, password_hash FROM HR_USERS WHERE username = :username"
        cursor.execute(query, {"username": username})
        result = cursor.fetchone()

        if result:
            # Return user credentials as a dictionary
            return {
                "success": True,
                "user": {"user_id": result[0], "username": result[1], "email": result[2], "password_hash": result[3]},
            }
        else:
            print("User not found!")  # Debugging
            return {"success": False, "error": "User not found."}
    except cx_Oracle.Error as error:
        print(f"Database error: {error}")
        return {"success": False, "error": str(error)}  # Handle database-specific errors
    except Exception as error:
        print(f"Error fetching user credentials: {error}")
        return {"success": False, "error": "An error occurred while retrieving user data."}
    finally:
        cursor.close()
        connection.close()


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
        cursor.execute(
            """
            SELECT job_id, job_title, min_salary, max_salary
            FROM hr_jobs
        """
        )
        job_data = cursor.fetchall()
        job_columns = [desc[0] for desc in cursor.description]
        cursor.close()
        connection.close()
        return job_data, job_columns, None
    except cx_Oracle.DatabaseError as e:
        return [], [], str(e)


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


def add_job(job_id, job_title, min_salary):
    try:
        print("add job called")
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.callproc("new_job", [job_id, job_title, min_salary])
        connection.commit()
        cursor.close()
        connection.close()
        return {"success": True, "message": "Job added successfully."}
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


# database.py
def add_employee(first_name, last_name, email, phone, hire_date, job_id, salary, manager_id, department_id):
    print("add employee called")
    connection = get_db_connection()
    cursor = connection.cursor()
    try:
        cursor.execute(
            """
            BEGIN
                employee_hire_sp(
                    :first_name, :last_name, :email, :phone,
                    TO_DATE(:hire_date, 'YYYY-MM-DD'), :job_id,
                    :salary, :manager_id, :department_id
                );
            END;
            """,
            {
                "first_name": first_name,
                "last_name": last_name,
                "email": email,
                "phone": phone,
                "hire_date": hire_date,  # String from form
                "job_id": job_id,
                "salary": salary,
                "manager_id": manager_id,
                "department_id": department_id,
            },
        )
        connection.commit()
        return {"success": True, "message": "Employee hired successfully."}
    except cx_Oracle.Error as error:
        print(f"Database error: {error}")
        return {"success": False, "error": str(error)}
    finally:
        cursor.close()
        connection.close()


def update_employee(
    emp_id,
    first_name=None,
    last_name=None,
    email=None,
    phone=None,
    job_id=None,
    salary=None,
    commission_pct=None,
    manager_id=None,
    department_id=None,
):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.callproc(
            "update_employee_sp",
            [emp_id, first_name, last_name, email, phone, job_id, salary, commission_pct, manager_id, department_id],
        )
        connection.commit()
        cursor.close()
        connection.close()
        return {"success": True, "message": "Employee updated successfully."}
    except cx_Oracle.DatabaseError as error:
        return {"success": False, "error": str(error)}


def fetch_manage_departments():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        query = """
            SELECT
                d.department_id,
                d.department_name,
                d.manager_id,
                d.location_id,
                e.employee_id,
                e.first_name,
                e.last_name,
                l.location_id AS loc_id,
                l.street_address,
                l.postal_code,
                l.city,
                l.state_province,
                l.country_id,
                c.country_id AS ctry_id,
                c.country_name,
                c.region_id,
                r.region_id AS reg_id,
                r.region_name
            FROM hr_departments d
            JOIN hr_employees e
                ON e.employee_id = d.manager_id
            JOIN hr_locations l
                ON d.location_id = l.location_id
            JOIN hr_countries c
                ON l.country_id = c.country_id
            JOIN hr_regions r
                ON c.region_id = r.region_id
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


def create_department(dept_id, dept_name, manager_id=None, location_id=None):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.callproc("create_department", [dept_id, dept_name, manager_id, location_id])
        connection.commit()
        cursor.close()
        connection.close()
        return {"success": True, "message": f"Department {dept_name} created successfully."}
    except cx_Oracle.DatabaseError as error:
        return {"success": False, "error": str(error)}


def update_department(dept_id, new_name=None, manager_id=None, location_id=None):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.callproc("update_department", [dept_id, new_name, manager_id, location_id])
        connection.commit()
        cursor.close()
        connection.close()
        return {"success": True, "message": f"Department {dept_id} updated successfully."}
    except cx_Oracle.DatabaseError as error:
        return {"success": False, "error": str(error)}


def delete_employee(emp_id):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.callproc("delete_employee", [emp_id])
        connection.commit()
        cursor.close()
        connection.close()
        return {"success": True, "message": f"Employee {emp_id} deleted successfully."}
    except cx_Oracle.DatabaseError as error:
        return {"success": False, "error": str(error)}


def delete_job(job_id):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.callproc("delete_job", [job_id])
        connection.commit()
        cursor.close()
        connection.close()
        return {"success": True, "message": f"Job {job_id} deleted successfully."}
    except cx_Oracle.DatabaseError as error:
        return {"success": False, "error": str(error)}


def delete_department(dept_id):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.callproc("delete_department", [dept_id])
        connection.commit()
        cursor.close()
        connection.close()
        return {"success": True, "message": f"Department {dept_id} deleted successfully."}
    except cx_Oracle.DatabaseError as error:
        return {"success": False, "error": str(error)}


def fetch_locations():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        query = """
            SELECT
                l.location_id,
                l.street_address,
                l.postal_code,
                l.city,
                l.state_province,
                l.country_id,
                c.country_name,
                r.region_name
            FROM hr_locations l
            JOIN hr_countries c ON l.country_id = c.country_id
            JOIN hr_regions r ON c.region_id = r.region_id
        """
        cursor.execute(query)
        table_data = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]
        cursor.close()
        connection.close()
        return table_data, column_names, None
    except cx_Oracle.Error as error:
        print(f"Database error: {error}")
        return [], [], str(error)


def fetch_users():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        query = "SELECT user_id, username, email, created_at, password_hash FROM HR_USERS"
        cursor.execute(query)
        table_data = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]
        return table_data, column_names, None  # Success: no error
    except cx_Oracle.Error as error:
        print(f"Database error: {error}")
        return [], [], str(error)  # Return error
    finally:
        cursor.close()
        connection.close()


def add_user(username, email, password_hash):
    try:
        print("add user called")
        connection = get_db_connection()  # Establish the database connection
        cursor = connection.cursor()  # Create a cursor object
        cursor.callproc("new_user", [username, email, password_hash])  # Call the stored procedure
        connection.commit()  # Commit the transaction
        cursor.close()  # Close the cursor
        connection.close()  # Close the connection
        return {"success": True, "message": "User added successfully."}  # Return success message
    except cx_Oracle.Error as error:
        print(f"Database error: {error}")  # Print the error for debugging
        return {"success": False, "error": str(error)}  # Return error message


def update_user(user_id, username, email):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.callproc("update_user", [user_id, username, email])
        connection.commit()
        cursor.close()
        connection.close()
        return {"success": True, "message": "User updated successfully."}
    except cx_Oracle.Error as error:
        print(f"Database error: {error}")
        return {"success": False, "error": str(error)}


def delete_user(user_id):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.callproc("delete_user", [user_id])
        connection.commit()
        cursor.close()
        connection.close()
        return {"success": True, "message": "User deleted successfully."}
    except cx_Oracle.Error as error:
        print(f"Database error: {error}")
        return {"success": False, "error": str(error)}
