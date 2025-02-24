from flask import Flask, render_template

# Create a Flask Instance
app = Flask(__name__)


# Create a route decorator
@app.route("/")
def index():
    # flash("Welcome To Our Website!")
    return render_template("index.html")
    # return "<h1>Hello World!</h1>"


@app.route("/tables")
def tables():
    return render_template("tables.html")


@app.route("/dashboard_chart")
def dashboard_chart():
    return render_template("dashboard_chart.html")
