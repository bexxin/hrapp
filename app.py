# app.py

# region IMPORTS
import datetime
from flask import Flask, jsonify, render_template, request
from database import (
    add_job,
    delete_department,
    delete_employee,
    delete_job,
    fetch_employees,
    fetch_departments,
    fetch_manage_departments,
    fetch_manage_employees,
    fetch_jobs,
    add_employee,
    get_job_desc,
    update_department,
    update_job_details,
    fetch_locations,
)
import setup_database

# endregion

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


# region DASHBOARD
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


@app.route("/dashboard_chart")
def dashboard_chart():
    return render_template("dashboard_chart.html")


# endregion


# region EMPLOYEE
@app.route("/hire_employee", methods=["GET"])
def hire_employee():
    # Fetch data for dropdowns
    emp_data, emp_columns, emp_error = fetch_manage_employees()
    emp_data = serialize_employee_data(emp_data)

    job_data, job_columns, job_error = fetch_jobs()
    job_options = [[row[0], row[1]] for row in job_data] if not job_error else []

    dept_data, dept_columns, dept_error = fetch_departments()
    department_options = [[row[0], row[1]] for row in dept_data] if not dept_error else []

    return render_template(
        "hire_employee.html", emp_data=emp_data, job_options=job_options, department_options=department_options
    )


@app.route("/hire_employee", methods=["POST"])
def api_hire_employee():
    try:
        data = request.json
        mandatory_fields = [
            "first_name",
            "last_name",
            "email",
            "phone",
            "hire_date",
            "job_id",
            "salary",
            "manager_id",
            "department_id",
        ]
        if not all(field in data for field in mandatory_fields):
            return jsonify({"success": False, "error": "Missing required fields"}), 400

        result = add_employee(
            first_name=data["first_name"],
            last_name=data["last_name"],
            email=data["email"],
            phone=data["phone"],
            hire_date=data["hire_date"],
            job_id=data["job_id"],
            salary=data["salary"],
            manager_id=data["manager_id"],
            department_id=data["department_id"],
        )
        return jsonify(result)
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


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
@app.route("/update_employee", methods=["PUT"])
def api_update_employee():
    try:
        data = request.json
        emp_id = data.get("employee_id")

        if not emp_id:
            return jsonify({"success": False, "error": "Employee ID is required"}), 400

        result = update_employee(
            emp_id=emp_id,
            first_name=data.get("first_name"),
            last_name=data.get("last_name"),
            email=data.get("email"),
            phone=data.get("phone"),
            job_id=data.get("job_id"),
            salary=data.get("salary"),
            commission_pct=data.get("commission_pct"),
            manager_id=data.get("manager_id"),
            department_id=data.get("department_id"),
        )

        return jsonify(result), 200 if result["success"] else 500
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/delete_employee", methods=["DELETE"])
def delete_emp():
    emp_id = request.json.get("id")
    if not emp_id:
        return jsonify({"error": "employee_id is required"}), 400

    result = delete_employee(emp_id)
    return jsonify(result), 200 if result["success"] else 500


# endregion


# region JOB
@app.route("/get_job_title", methods=["GET"])
def api_get_job_title():
    job_id = request.args.get("job_id")
    if not job_id:
        return jsonify({"success": False, "error": "Missing job id"}), 400
    result = get_job_desc(job_id)
    return jsonify(result)


@app.route("/update_job", methods=["POST"])
def api_update_job():
    try:
        data = request.json
        job_id = data.get("job_id")
        if not job_id:
            return jsonify({"success": False, "error": "Missing job id"}), 400
        new_title = data.get("job_title")  # Changed from "new_title" to match frontend
        min_salary = data.get("min_salary")
        max_salary = data.get("max_salary")

        result = update_job_details(job_id, new_title, min_salary, max_salary)
        if result["success"]:
            return jsonify({"status": "success", "message": result["message"]})
        else:
            return jsonify({"status": "error", "message": result["error"]}), 500
    except Exception as e:
        return jsonify({"status": "error", "error": str(e)}), 500


# app.py (add these routes)
@app.route("/new_job", methods=["GET"])
def new_job_page():
    return render_template("new_job.html")


@app.route("/new_job", methods=["POST"])
def new_job():
    try:
        data = request.json
        mandatory_fields = ["job_id", "job_title", "min_salary"]
        if not all(field in data for field in mandatory_fields):
            return jsonify({"success": False, "error": "Missing required fields"}), 400

        result = add_job(job_id=data["job_id"], job_title=data["job_title"], min_salary=data["min_salary"])
        return jsonify(result)
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/manage_job")
def manage_job():
    job_data, job_columns, job_error = fetch_jobs()
    if job_error:
        return render_template("manage_job.html", jobs=[], first_job={}, job_error=job_error)
    jobs = [{"job_id": row[0], "job_title": row[1], "min_salary": row[2], "max_salary": row[3]} for row in job_data]
    first_job = jobs[0] if jobs else {}
    return render_template("manage_job.html", jobs=jobs, first_job=first_job, job_error=None)


@app.route("/delete_job", methods=["DELETE"])
def api_delete_job():
    job_id = request.json.get("id")
    if not job_id:
        return jsonify({"error": "job_id is required"}), 400

    result = delete_job(job_id)
    return jsonify(result), 200 if result["success"] else 500


# endregion


# region DEPARTMENT
@app.route("/new_department")
def new_department():
    return render_template("new_department.html")


# @app.route("/manage_department")
# def manage_department():
#     dept_data, dept_columns, dept_error = fetch_manage_departments()
#     if dept_error:
#         return render_template("manage_department.html", departments=[], first_dept={}, dept_error=dept_error)
#     departments = [
#         {
#             "department_id": row[0],
#             "department_name": row[1],
#             "manager_id": row[2],
#             "location_id": row[3],
#             "employee_id": row[4],
#             "first_name": row[5],
#             "last_name": row[6],
#             "loc_id": row[7],
#             "street_address": row[8],
#             "postal_code": row[9],
#             "city": row[10],
#             "state_province": row[11],
#             "country_id": row[12],
#             "ctry_id": row[13],
#             "country_name": row[14],
#             "region_id": row[15],
#             "reg_id": row[16],
#             "region_name": row[17],
#         }
#         for row in dept_data
#     ]
#     first_dept = departments[0] if departments else {}
#     return render_template("manage_department.html", departments=departments, first_dept=first_dept, dept_error=None)


# app.py
@app.route("/manage_department")
def manage_department():
    dept_data, dept_columns, dept_error = fetch_manage_departments()
    emp_data, emp_columns, emp_error = fetch_manage_employees()  # For manager dropdowns
    loc_data, loc_columns, loc_error = fetch_locations()  # For location dropdowns

    emp_data = serialize_employee_data(emp_data)  # Serialize dates

    if dept_error or emp_error or loc_error:
        return render_template(
            "manage_department.html",
            departments=[],
            employees=[],
            locations=[],
            first_dept={},
            dept_error=dept_error or emp_error or loc_error,
        )

    departments = [
        {
            "department_id": row[0],
            "department_name": row[1],
            "manager_id": row[2],
            "location_id": row[3],
            "employee_id": row[4],
            "first_name": row[5],
            "last_name": row[6],
            "loc_id": row[7],
            "street_address": row[8],
            "postal_code": row[9],
            "city": row[10],
            "state_province": row[11],
            "country_id": row[12],
            "ctry_id": row[13],
            "country_name": row[14],
            "region_id": row[15],
            "reg_id": row[16],
            "region_name": row[17],
        }
        for row in dept_data
    ]
    employees = [{"employee_id": row[0], "first_name": row[1], "last_name": row[2]} for row in emp_data]
    locations = [
        {
            "location_id": row[0],
            "street_address": row[1],
            "postal_code": row[2],
            "city": row[3],
            "state_province": row[4],
            "country_id": row[5],
            "country_name": row[6],  # Assuming fetch_locations includes this
            "region_name": row[7],  # Assuming fetch_locations includes this
        }
        for row in loc_data
    ]
    first_dept = departments[0] if departments else {}
    return render_template(
        "manage_department.html",
        departments=departments,
        employees=employees,
        locations=locations,
        first_dept=first_dept,
        dept_error=None,
    )


@app.route("/update_department", methods=["PUT"])
def api_update_department():
    data = request.json
    dept_id = data.get("dept_id")
    if not dept_id:
        return jsonify({"error": "dept_id is required"}), 400

    result = update_department(dept_id, data.get("new_name"), data.get("manager_id"), data.get("location_id"))
    return jsonify(result), 200 if result["success"] else 500


@app.route("/delete_department", methods=["DELETE"])
def api_delete_department():
    dept_id = request.json.get("id")
    if not dept_id:
        return jsonify({"error": "dept_id is required"}), 400

    result = delete_department(dept_id)
    return jsonify(result), 200 if result["success"] else 500


# endregion

if __name__ == "__main__":
    setup_database.run_sql_scripts()
    app.run(debug=True)
