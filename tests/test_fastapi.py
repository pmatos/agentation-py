"""Tests for FastAPI/Starlette middleware."""

from starlette.testclient import TestClient
from starlette.applications import Starlette
from starlette.responses import HTMLResponse, JSONResponse
from starlette.routing import Route

from agentation import AgentationConfig
from agentation.adapters.fastapi import AgentationMiddleware


def create_app(config=None, debug=False):
    async def homepage(request):
        return HTMLResponse("<html><body><h1>Hello</h1></body></html>")

    async def api(request):
        return JSONResponse({"status": "ok"})

    app = Starlette(debug=debug, routes=[
        Route("/", homepage),
        Route("/api", api),
    ])
    app.add_middleware(AgentationMiddleware, config=config)
    return app


def test_middleware_injects_when_enabled():
    config = AgentationConfig(enabled=True)
    app = create_app(config=config)
    client = TestClient(app)
    response = client.get("/")
    assert "__AGENTATION_CONFIG__" in response.text


def test_middleware_skips_non_html():
    config = AgentationConfig(enabled=True)
    app = create_app(config=config)
    client = TestClient(app)
    response = client.get("/api")
    assert "__AGENTATION_CONFIG__" not in response.text


def test_middleware_disabled_explicitly():
    config = AgentationConfig(enabled=False)
    app = create_app(config=config, debug=True)
    client = TestClient(app)
    response = client.get("/")
    assert "__AGENTATION_CONFIG__" not in response.text


def test_middleware_uses_debug_mode():
    app = create_app(debug=True)
    client = TestClient(app)
    response = client.get("/")
    assert "__AGENTATION_CONFIG__" in response.text


def test_middleware_includes_route():
    config = AgentationConfig(enabled=True)
    app = create_app(config=config)
    client = TestClient(app)
    response = client.get("/")
    assert '"route":"/"' in response.text


def test_middleware_default_config():
    # With no config and no debug, should not inject
    app = create_app()
    client = TestClient(app)
    response = client.get("/")
    assert "__AGENTATION_CONFIG__" not in response.text
