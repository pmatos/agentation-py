"""Example Flask application with Agentation."""

from flask import Flask, render_template

from agentation import AgentationFlask

app = Flask(__name__)
app.debug = True

# Initialize Agentation
AgentationFlask(app)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/about")
def about():
    return render_template("about.html")


if __name__ == "__main__":
    app.run(debug=True, port=5000)
