# app.py
import datetime
from flask import Flask, render_template
from database import fetch_employees, fetch_departments, fetch_manage_employees

app = Flask(__name__)


def serialize_employee_data(emp_data):
    """Convert datetime objects in emp_data to strings."""
    serialized_data = []
    for row in emp_data:
        # Assuming row is a tuple with datetime at index 5 (Hire Date)
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
    emp_data = serialize_employee_data(emp_data)  # Serialize datetime
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
    emp_data = serialize_employee_data(emp_data)  # Serialize datetime
    return render_template(
        "manage_employee.html",
        emp_data=emp_data,
        emp_columns=emp_columns,
        emp_error=emp_error,
    )


@app.route("/new_job")
def new_job():
    return render_template("new_job.html")


@app.route("/manage_job")
def manage_job():
    return render_template("manage_job.html")


@app.route("/dashboard_chart")
def dashboard_chart():
    return render_template("dashboard_chart.html")


if __name__ == "__main__":
    app.run(debug=True)
