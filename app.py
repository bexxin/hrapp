# app.py
from flask import Flask, render_template
from database import fetch_employees, fetch_departments

# Create a Flask Instance
app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/tables")
def tables():
    emp_data, emp_columns, emp_error = fetch_employees()
    dept_data, dept_columns, dept_error = fetch_departments()
    return render_template(
        "tables.html",
        emp_data=emp_data,
        emp_columns=emp_columns,
        emp_error=emp_error,
        dept_data=dept_data,
        dept_columns=dept_columns,
        dept_error=dept_error,
    )


@app.route("/dashboard_chart")
def dashboard_chart():
    return render_template("dashboard_chart.html")


if __name__ == "__main__":
    app.run(debug=True)
