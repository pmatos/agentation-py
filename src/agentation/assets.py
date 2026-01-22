"""Asset loading for Agentation."""

from __future__ import annotations

from functools import lru_cache
from importlib import resources


@lru_cache(maxsize=1)
def get_js_content() -> str:
    """Load the bundled JavaScript content."""
    try:
        files = resources.files("agentation")
        js_path = files.joinpath("static", "agentation.min.js")
        return js_path.read_text(encoding="utf-8")
    except (TypeError, AttributeError):
        with resources.open_text("agentation.static", "agentation.min.js") as f:
            return f.read()
