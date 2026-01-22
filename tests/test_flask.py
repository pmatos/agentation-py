"""Tests for Flask extension."""

import pytest
from flask import Flask

from agentation import AgentationConfig
from agentation.adapters.flask import AgentationFlask


@pytest.fixture
def app():
    """Create test Flask app."""
    app = Flask(__name__)
    app.debug = True

    @app.route("/")
    def index():
        return "<html><body><h1>Hello</h1></body></html>"

    @app.route("/json")
    def json_route():
        return {"message": "hello"}

    return app


def test_flask_injects_in_debug_mode(app):
    """Agentation is injected when debug=True."""
    AgentationFlask(app)
    client = app.test_client()

    response = client.get("/")
    html = response.get_data(as_text=True)

    assert "__AGENTATION_CONFIG__" in html
    assert "<script" in html


def test_flask_not_injected_in_production():
    """Agentation is not injected when debug=False."""
    app = Flask(__name__)
    app.debug = False

    @app.route("/")
    def index():
        return "<html><body><h1>Hello</h1></body></html>"

    AgentationFlask(app)
    client = app.test_client()

    response = client.get("/")
    html = response.get_data(as_text=True)

    assert "__AGENTATION_CONFIG__" not in html


def test_flask_skips_non_html(app):
    """Non-HTML responses are not modified."""
    AgentationFlask(app)
    client = app.test_client()

    response = client.get("/json")
    data = response.get_json()

    assert data == {"message": "hello"}


def test_flask_includes_route(app):
    """Route endpoint is included in config."""
    AgentationFlask(app)
    client = app.test_client()

    response = client.get("/")
    html = response.get_data(as_text=True)

    assert '"route":"index"' in html or '"route":"/"' in html


def test_flask_custom_config(app):
    """Custom config is applied."""
    config = AgentationConfig(default_detail="forensic", accent_color="#ff0000")
    AgentationFlask(app, config=config)
    client = app.test_client()

    response = client.get("/")
    html = response.get_data(as_text=True)

    assert '"defaultDetail":"forensic"' in html
    assert '"accentColor":"#ff0000"' in html


def test_flask_init_app_pattern():
    """Factory pattern with init_app works."""
    app = Flask(__name__)
    app.debug = True

    @app.route("/")
    def index():
        return "<html><body><h1>Hello</h1></body></html>"

    agentation = AgentationFlask()
    agentation.init_app(app)

    client = app.test_client()
    response = client.get("/")
    html = response.get_data(as_text=True)

    assert "__AGENTATION_CONFIG__" in html
