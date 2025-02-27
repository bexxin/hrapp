# app.py
import datetime
from flask import Flask, render_template
from database import fetch_employees, fetch_departments, fetch_manage_employees, fetch_jobs

app = Flask(__name__)


def serialize_employee_data(emp_data):
    """Convert datetime objects in emp_data to strings."""
    serialized_data = []
    for row in emp_data:
        row_list = list(row)
        if isinstance(row_list[5], datetime.datetime):  # Hire Date
            row_list[5] = row_list[5].strftime("%Y-%m-%d")  # e.g., "2000-01-13"
        serialized_data.append(row_list)
    return serialized_data


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/tables")
def tables():
    emp_data, emp_columns, emp_error = fetch_employees()
    dept_data, dept_columns, dept_error = fetch_departments()
    emp_data = serialize_employee_data(emp_data)
    return render_template(
        "tables.html",
        emp_data=emp_data,
        emp_columns=emp_columns,
        emp_error=emp_error,
        dept_data=dept_data,
        dept_columns=dept_columns,
        dept_error=dept_error,
    )


@app.route("/hire_employee")
def hire_employee():
    return render_template("hire_employee.html")


@app.route("/manage_employee")
def manage_employee():
    emp_data, emp_columns, emp_error = fetch_manage_employees()
    emp_data = serialize_employee_data(emp_data)

    # Fetch job options
    job_data, job_columns, job_error = fetch_jobs()
    if not job_error:
        job_options = [[row[0], row[1]] for row in job_data]  # [job_id, job_title]
    else:
        job_options = []
        emp_error = emp_error or job_error

    # Fetch department options
    dept_data, dept_columns, dept_error = fetch_departments()
    if not dept_error:
        department_options = [[row[0], row[1]] for row in dept_data]  # [department_id, department_name]
    else:
        department_options = []
        emp_error = emp_error or dept_error

    # Get first employee's data (default to empty list if no data)
    first_employee = emp_data[0] if emp_data else []

    # Find first employee's manager data
    first_manager_id = first_employee[9] if first_employee else None
    first_manager = next((row for row in emp_data if row[0] == first_manager_id), []) if first_manager_id else []

    return render_template(
        "manage_employee.html",
        emp_data=emp_data,
        emp_columns=emp_columns,
        emp_error=emp_error,
        job_options=job_options,
        department_options=department_options,
        first_employee=first_employee,
        first_manager=first_manager,
    )


@app.route("/new_job")
def new_job():
    return render_template("new_job.html")


@app.route("/manage_job")
def manage_job():
    return render_template("manage_job.html")


@app.route("/new_department")
def new_department():
    return render_template("new_department.html")


@app.route("/manage_department")
def manage_department():
    return render_template("manage_department.html")


@app.route("/dashboard_chart")
def dashboard_chart():
    return render_template("dashboard_chart.html")


if __name__ == "__main__":
    app.run(debug=True)
