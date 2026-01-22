"""Tests for asset loading."""

from agentation.assets import get_js_content


def test_get_js_content_returns_string():
    """JS content is loaded as string."""
    content = get_js_content()
    assert isinstance(content, str)
    assert len(content) > 0


def test_get_js_content_contains_agentation():
    """JS content contains Agentation marker."""
    content = get_js_content()
    assert "Agentation" in content or "agentation" in content.lower()
