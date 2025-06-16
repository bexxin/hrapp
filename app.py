# app.py

# region IMPORTS
import datetime
from flask import Flask, jsonify, render_template, request, redirect, url_for, session, flash
from werkzeug.security import check_password_hash, generate_password_hash
from functools import wraps
from setup_database import SECRET_KEY
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
    fetch_users,
    add_employee,
    get_job_desc,
    update_department,
    update_job_details,
    fetch_locations,
    update_employee,
    get_user_credentials,
    add_user,
    update_user,
    delete_user,
    create_department
)
import setup_database

# endregion

app = Flask(__name__)
app.secret_key = SECRET_KEY

# region Login - Logout


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if "user_id" not in session:
            flash("You must log in to access this page.", "warning")
            return redirect(url_for("login"))
        return f(*args, **kwargs)

    return decorated_function


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        print(f"Username: {username}, Password: {password}")  # Debugging

        try:
            result = get_user_credentials(username)
            print(f"Result: {result}")  # Debugging

            if result["success"]:
                user = result["user"]
                if check_password_hash(user["password_hash"], password):
                    session["user_id"] = user["user_id"]
                    session["username"] = user["username"]
                    flash("Login successful!", "success")
                    return redirect(url_for("index"))  # Redirect to index.html
                else:
                    flash("Invalid username or password.", "danger")
            else:
                flash(result["error"], "danger")
        except Exception as error:
            print(f"Error during login: {error}")  # Debugging
            flash("An error occurred. Please try again later.", "danger")

    return render_template("login.html")


@app.route("/logout")
@login_required
def logout():
    # Clear the session data
    session.clear()
    flash("You have been logged out successfully.", "success")
    return redirect(url_for("login"))


# Endregion


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
@login_required
def index():
    return render_template("index.html")


# region DASHBOARD
@app.route("/tables")
@login_required
def tables():
    emp_data, emp_columns, emp_error = fetch_employees()
    dept_data, dept_columns, dept_error = fetch_departments()
    job_data, job_columns, job_error = fetch_jobs()
    user_data, user_columns, user_error = fetch_users()

    emp_data = serialize_employee_data(emp_data)
    return render_template(
        "tables.html",
        emp_data=emp_data,
        emp_columns=emp_columns,
        emp_error=emp_error,
        dept_data=dept_data,
        dept_columns=dept_columns,
        dept_error=dept_error,
        job_data=job_data,
        job_columns=job_columns,
        job_error=job_error,
        user_data=user_data,
        user_columns=user_columns,
        user_error=user_error,
    )


@app.route("/dashboard_chart")
@login_required
def dashboard_chart():
    return render_template("dashboard_chart.html")


# endregion


# region EMPLOYEE
@app.route("/hire_employee", methods=["GET"])
@login_required
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
@login_required
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
@login_required
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
@login_required
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
@login_required
def delete_emp():
    emp_id = request.json.get("id")
    if not emp_id:
        return jsonify({"error": "employee_id is required"}), 400

    result = delete_employee(emp_id)
    return jsonify(result), 200 if result["success"] else 500


# endregion


# region JOB
@app.route("/get_job_title", methods=["GET"])
@login_required
def api_get_job_title():
    job_id = request.args.get("job_id")
    if not job_id:
        return jsonify({"success": False, "error": "Missing job id"}), 400
    result = get_job_desc(job_id)
    return jsonify(result)


@app.route("/update_job", methods=["POST"])
@login_required
def api_update_job():
    try:
        data = request.json
        job_id = data.get("job_id")
        if not job_id:
            return jsonify({"success": False, "error": "Missing job id"}), 400
        new_title = data.get("job_title")
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
@login_required
def new_job_page():
    return render_template("new_job.html")


@app.route("/new_job", methods=["POST"])
@login_required
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
@login_required
def manage_job():
    job_data, job_columns, job_error = fetch_jobs()
    if job_error:
        return render_template("manage_job.html", jobs=[], first_job={}, job_error=job_error)
    jobs = [{"job_id": row[0], "job_title": row[1], "min_salary": row[2], "max_salary": row[3]} for row in job_data]
    first_job = jobs[0] if jobs else {}
    return render_template("manage_job.html", jobs=jobs, first_job=first_job, job_error=None)


@app.route("/delete_job", methods=["DELETE"])
@login_required
def api_delete_job():
    job_id = request.json.get("id")
    if not job_id:
        return jsonify({"error": "job_id is required"}), 400

    result = delete_job(job_id)
    return jsonify(result), 200 if result["success"] else 500


# endregion


# region DEPARTMENT
@app.route("/new_department")
@login_required
def new_department():
    employee_data, _ , emp_error = fetch_employees()
    if emp_error:
        employee_data=[]
    location_data,_,loc_error= fetch_locations()
    if loc_error:
        location_data=[]
    return render_template("new_department.html", emp_data=employee_data, loc_data=location_data)


@app.route("/new_department/submit", methods=["POST"])
@login_required
def submit_new_dept():
    data=request.get_json()
    department_name=data.get("department_name")
    manager_id=data.get("manager_id")
    location_id=data.get("location_id")

    #dept_id generated automatically in sp.
    create_department(department_name,manager_id,location_id)

    return jsonify(({"success": True, "message": "Department created successfully."}))

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
@login_required
def manage_department():
    dept_data, dept_columns, dept_error = fetch_manage_departments()
    emp_data, emp_columns, emp_error = fetch_manage_employees()
    loc_data, loc_columns, loc_error = fetch_locations()

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
            "country_name": row[6],
            "region_name": row[7],
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
@login_required
def api_update_department():
    data = request.json
    dept_id = data.get("dept_id")
    if not dept_id:
        return jsonify({"error": "dept_id is required"}), 400

    result = update_department(dept_id, data.get("new_name"), data.get("manager_id"), data.get("location_id"))
    return jsonify(result), 200 if result["success"] else 500


@app.route("/delete_department", methods=["DELETE"])
@login_required
def api_delete_department():
    dept_id = request.json.get("id")
    if not dept_id:
        return jsonify({"error": "dept_id is required"}), 400

    result = delete_department(dept_id)
    return jsonify(result), 200 if result["success"] else 500


# endregion


# Region Users
@app.route("/new_user", methods=["GET"])
@login_required
def new_user_page():
    return render_template("new_user.html")


@app.route("/new_user", methods=["POST"])
@login_required
def new_user():
    data = request.json  # Extract data from the form submission
    try:
        username = data["username"]
        email = data["email"]
        raw_password = data["password"]  # The raw password entered by the user

        # Hash the password
        hashed_password = generate_password_hash(raw_password)

        # Save the user to the database
        result = add_user(username, email, hashed_password)

        if result["success"]:
            return jsonify({"success": True, "message": "User added successfully!"})
        else:
            return jsonify({"success": False, "error": result["error"]})

    except KeyError as e:
        return jsonify({"success": False, "error": f"Missing field: {e}"})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})


@app.route("/manage_user", methods=["GET"])
@login_required
def manage_user():
    # Handle GET request for displaying the page with user data
    user_data, user_columns, user_error = fetch_users()
    if user_error:
        return render_template("manage_user.html", users=[], first_user={}, user_error=user_error)

    users = [
        {"user_id": row[0], "username": row[1], "email": row[2], "created_at": row[3], "password_hash": row[4]}
        for row in user_data
    ]

    first_user = users[0] if users else {}  # Get the first user for form defaults
    return render_template("manage_user.html", users=users, first_user=first_user, user_error=None)


@app.route("/update_user", methods=["POST"])
@login_required
def api_update_user():
    data = request.json
    user_id = data.get("user_id")
    username = data.get("username")
    email = data.get("email")

    if not user_id or not username or not email:
        return jsonify({"success": False, "error": "Missing required fields."})

    result = update_user(user_id, username, email)
    return jsonify(result)


@app.route("/delete_user", methods=["DELETE"])
@login_required
def api_delete_user():
    data = request.json
    user_id = data.get("id")
    print(f"Received data: {data}")
    print(f"Received id: {user_id}")

    if not user_id:
        return jsonify({"success": False, "error": "User ID is required."})

    result = delete_user(user_id)
    return jsonify(result)


# Endregion

if __name__ == "__main__":
    setup_database.run_sql_scripts()
    setup_database.run_create_users_procedure()
    app.run(debug=True)
