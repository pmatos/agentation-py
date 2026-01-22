"""Tests for HTML injection."""

from agentation.config import AgentationConfig
from agentation.injector import inject_agentation


def test_inject_adds_script_before_body():
    """Script is injected before </body>."""
    html = "<html><body><h1>Hello</h1></body></html>"
    config = AgentationConfig()
    result = inject_agentation(html, config)

    assert "<script" in result
    assert result.index("<script") < result.index("</body>")


def test_inject_adds_config():
    """Config JSON is injected."""
    html = "<html><body></body></html>"
    config = AgentationConfig(default_detail="forensic")
    result = inject_agentation(html, config)

    assert "__AGENTATION_CONFIG__" in result
    assert '"defaultDetail":"forensic"' in result


def test_inject_includes_route():
    """Route is included in config when provided."""
    html = "<html><body></body></html>"
    config = AgentationConfig()
    result = inject_agentation(html, config, route="/dashboard")

    assert '"route":"/dashboard"' in result


def test_inject_no_body_returns_unchanged():
    """HTML without </body> is returned unchanged."""
    html = "<html><head></head></html>"
    config = AgentationConfig()
    result = inject_agentation(html, config)

    assert result == html


def test_inject_preserves_html_structure():
    """Original HTML structure is preserved."""
    html = """<!DOCTYPE html>
<html>
<head><title>Test</title></head>
<body>
<div class="content">Hello World</div>
</body>
</html>"""
    config = AgentationConfig()
    result = inject_agentation(html, config)

    assert "<!DOCTYPE html>" in result
    assert "<title>Test</title>" in result
    assert '<div class="content">Hello World</div>' in result


def test_inject_excludes_route_when_disabled():
    """Route is excluded when include_route is False."""
    html = "<html><body></body></html>"
    config = AgentationConfig(include_route=False)
    result = inject_agentation(html, config, route="/dashboard")

    assert '"route"' not in result
