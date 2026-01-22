"""Asset loading for Agentation."""

from __future__ import annotations

import sys
from functools import lru_cache
from importlib import resources

if sys.version_info >= (3, 11):
    from importlib.resources.abc import Traversable
else:
    from importlib.abc import Traversable


@lru_cache(maxsize=1)
def get_js_content() -> str:
    """Load the bundled JavaScript content."""
    try:
        files: Traversable = resources.files("agentation")
        js_path: Traversable = files.joinpath("static").joinpath("agentation.min.js")
        return js_path.read_text(encoding="utf-8")
    except (TypeError, AttributeError):
        with resources.open_text("agentation.static", "agentation.min.js") as f:
            return f.read()
