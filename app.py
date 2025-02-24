# app.py
from flask import Flask, render_template
from database import fetch_employees

# Create a Flask Instance
app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/tables")
def tables():
    table_data, column_names, error = fetch_employees()
    if error:
        return render_template("tables.html", table_data=[], column_names=column_names, error=error)
    return render_template("tables.html", table_data=table_data, column_names=column_names)


@app.route("/dashboard_chart")
def dashboard_chart():
    return render_template("dashboard_chart.html")


if __name__ == "__main__":
    app.run(debug=True)
