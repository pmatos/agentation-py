# Agentation-py Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a Python package that injects a visual annotation toolbar into web pages, enabling click-to-annotate feedback for AI coding agents.

**Architecture:** Framework-agnostic Python core that injects bundled vanilla JavaScript. Thin adapters for Flask and FastAPI. All annotation logic in JS, Python only handles config and injection.

**Tech Stack:** Python 3.10+, esbuild (JS bundling), pytest, Playwright (browser tests)

---

## Phase 1: Project Setup & Build Infrastructure

### Task 1.1: Initialize Python Package Structure

**Files:**
- Create: `pyproject.toml`
- Create: `src/agentation/__init__.py`
- Create: `src/agentation/py.typed`
- Create: `LICENSE`
- Create: `CLAUDE.md`

**Step 1: Create pyproject.toml**

```toml
[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[project]
name = "agentation"
version = "0.1.0"
description = "Visual feedback tool for AI coding agents"
readme = "README.md"
license = "MIT"
requires-python = ">=3.10"
authors = [
    { name = "Paulo Matos", email = "pmatos@linki.tools" }
]
classifiers = [
    "Development Status :: 3 - Alpha",
    "Framework :: Flask",
    "Framework :: FastAPI",
    "Intended Audience :: Developers",
    "License :: OSI Approved :: MIT License",
    "Programming Language :: Python :: 3.10",
    "Programming Language :: Python :: 3.11",
    "Programming Language :: Python :: 3.12",
    "Programming Language :: Python :: 3.13",
    "Topic :: Software Development :: Debuggers",
]
keywords = ["ai", "coding", "agents", "debugging", "flask", "fastapi"]

dependencies = []

[project.optional-dependencies]
flask = ["flask>=2.0"]
fastapi = ["fastapi>=0.100", "starlette>=0.27"]
dev = [
    "pytest>=7.0",
    "pytest-asyncio>=0.21",
    "ruff>=0.1",
    "pyright>=1.1",
    "flask>=2.0",
    "fastapi>=0.100",
    "httpx>=0.24",
]

[project.urls]
Homepage = "https://github.com/pmatos/agentation-py"
Repository = "https://github.com/pmatos/agentation-py"
Issues = "https://github.com/pmatos/agentation-py/issues"

[tool.hatch.build.targets.wheel]
packages = ["src/agentation"]

[tool.ruff]
line-length = 100
target-version = "py310"

[tool.ruff.lint]
select = ["E", "F", "I", "UP", "B"]

[tool.pyright]
pythonVersion = "3.10"
typeCheckingMode = "strict"
```

**Step 2: Create src/agentation/__init__.py**

```python
"""Agentation: Visual feedback tool for AI coding agents."""

__version__ = "0.1.0"

from agentation.config import AgentationConfig
from agentation.injector import inject_agentation, is_enabled

__all__ = [
    "AgentationConfig",
    "inject_agentation",
    "is_enabled",
    "__version__",
]
```

**Step 3: Create src/agentation/py.typed**

Empty file (marker for PEP 561).

**Step 4: Create LICENSE**

```
MIT License

Copyright (c) 2026 Paulo Matos

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

**Step 5: Create CLAUDE.md**

```markdown
# Agentation-py

Visual feedback tool for AI coding agents - Python port.

## Development

- Use `uv` for Python environment management
- Run `npm run build` to bundle JavaScript
- Run `pytest` for tests

## Architecture

- Python core in `src/agentation/` - handles config and HTML injection
- JavaScript source in `src/js/` - all annotation logic
- Built JS goes to `src/agentation/static/agentation.min.js`

## Testing

- `pytest tests/` - Python unit and integration tests
- `pytest tests/test_browser.py` - Playwright browser tests (requires `npm run build` first)
```

**Step 6: Commit**

```bash
git add pyproject.toml src/agentation/__init__.py src/agentation/py.typed LICENSE CLAUDE.md
git commit -m "chore: initialize Python package structure"
```

---

### Task 1.2: Set Up JavaScript Build Infrastructure

**Files:**
- Create: `package.json`
- Create: `src/js/index.js` (placeholder)
- Create: `.gitignore`

**Step 1: Create package.json**

```json
{
  "name": "agentation-py-js",
  "version": "0.1.0",
  "private": true,
  "description": "JavaScript module for agentation-py",
  "scripts": {
    "build": "esbuild src/js/index.js --bundle --minify --format=iife --global-name=Agentation --outfile=src/agentation/static/agentation.min.js",
    "build:dev": "esbuild src/js/index.js --bundle --format=iife --global-name=Agentation --outfile=src/agentation/static/agentation.min.js --sourcemap",
    "watch": "esbuild src/js/index.js --bundle --format=iife --global-name=Agentation --outfile=src/agentation/static/agentation.min.js --sourcemap --watch"
  },
  "devDependencies": {
    "esbuild": "^0.20.0"
  }
}
```

**Step 2: Create src/js/index.js placeholder**

```javascript
/**
 * Agentation - Visual feedback tool for AI coding agents
 * @version 0.1.0
 */

(function() {
  'use strict';

  console.log('Agentation loaded');

  // Placeholder - will be replaced with actual implementation
  window.__AGENTATION_LOADED__ = true;
})();
```

**Step 3: Create .gitignore**

```
# Python
__pycache__/
*.py[cod]
*$py.class
*.egg-info/
dist/
build/
.eggs/
*.egg

# Virtual environments
.venv/
venv/
ENV/

# Node
node_modules/

# IDE
.idea/
.vscode/
*.swp
*.swo

# Testing
.pytest_cache/
.coverage
htmlcov/

# OS
.DS_Store
Thumbs.db

# Local
.env
*.local
```

**Step 4: Create static directory**

```bash
mkdir -p src/agentation/static
```

**Step 5: Install npm dependencies and build**

```bash
npm install
npm run build
```

**Step 6: Verify build output exists**

```bash
ls -la src/agentation/static/agentation.min.js
```

**Step 7: Commit**

```bash
git add package.json package-lock.json src/js/index.js .gitignore src/agentation/static/
git commit -m "chore: set up JavaScript build infrastructure with esbuild"
```

---

## Phase 2: Python Core

### Task 2.1: Implement Configuration Dataclass

**Files:**
- Create: `src/agentation/config.py`
- Create: `tests/test_config.py`

**Step 1: Write test_config.py**

```python
"""Tests for AgentationConfig."""

import pytest
from agentation.config import AgentationConfig


def test_config_defaults():
    """Test default configuration values."""
    config = AgentationConfig()
    assert config.enabled is None
    assert config.default_detail == "standard"
    assert config.default_format == "markdown"
    assert config.position == "bottom-right"
    assert config.theme == "auto"
    assert config.accent_color == "#3b82f6"
    assert config.keyboard_shortcut == "ctrl+shift+a"
    assert config.block_interactions is True
    assert config.auto_clear_on_copy is False
    assert config.include_route is True


def test_config_custom_values():
    """Test configuration with custom values."""
    config = AgentationConfig(
        enabled=True,
        default_detail="forensic",
        default_format="json",
        position="top-left",
        theme="dark",
        accent_color="#ff0000",
    )
    assert config.enabled is True
    assert config.default_detail == "forensic"
    assert config.default_format == "json"
    assert config.position == "top-left"
    assert config.theme == "dark"
    assert config.accent_color == "#ff0000"


def test_config_to_dict():
    """Test configuration serialization to dict."""
    config = AgentationConfig(enabled=True, default_detail="compact")
    d = config.to_dict()
    assert d["enabled"] is True
    assert d["defaultDetail"] == "compact"
    assert d["position"] == "bottom-right"
```

**Step 2: Run test to verify it fails**

```bash
pytest tests/test_config.py -v
```

Expected: FAIL with "ModuleNotFoundError: No module named 'agentation.config'"

**Step 3: Create conftest.py for test discovery**

```python
"""Pytest configuration."""

import sys
from pathlib import Path

# Add src to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))
```

**Step 4: Implement config.py**

```python
"""Configuration for Agentation."""

from __future__ import annotations

import os
from dataclasses import dataclass
from typing import Any, Literal


@dataclass
class AgentationConfig:
    """Configuration for Agentation toolbar injection."""

    # Enabling (precedence: enabled > env var > debug detection)
    enabled: bool | None = None

    # Output settings
    default_detail: Literal["compact", "standard", "detailed", "forensic"] = "standard"
    default_format: Literal["markdown", "json"] = "markdown"

    # UI settings
    position: Literal["bottom-right", "bottom-left", "top-right", "top-left"] = "bottom-right"
    theme: Literal["auto", "light", "dark"] = "auto"
    accent_color: str = "#3b82f6"

    # Behavior
    keyboard_shortcut: str = "ctrl+shift+a"
    block_interactions: bool = True
    auto_clear_on_copy: bool = False
    include_route: bool = True

    def to_dict(self) -> dict[str, Any]:
        """Convert config to dict for JSON serialization (camelCase keys for JS)."""
        return {
            "enabled": self.enabled,
            "defaultDetail": self.default_detail,
            "defaultFormat": self.default_format,
            "position": self.position,
            "theme": self.theme,
            "accentColor": self.accent_color,
            "keyboardShortcut": self.keyboard_shortcut,
            "blockInteractions": self.block_interactions,
            "autoClearOnCopy": self.auto_clear_on_copy,
            "includeRoute": self.include_route,
        }


def is_enabled(config: AgentationConfig, framework_debug: bool | None = None) -> bool:
    """
    Determine if Agentation should be enabled.

    Precedence:
    1. Explicit config.enabled takes precedence
    2. AGENTATION_ENABLED environment variable
    3. Framework debug mode detection
    4. Default: False (safe)
    """
    # 1. Explicit config takes precedence
    if config.enabled is not None:
        return config.enabled

    # 2. Environment variable
    env = os.getenv("AGENTATION_ENABLED", "").lower()
    if env in ("true", "1", "yes"):
        return True
    if env in ("false", "0", "no"):
        return False

    # 3. Framework debug mode detection
    if framework_debug is not None:
        return framework_debug

    return False
```

**Step 5: Run tests to verify they pass**

```bash
pytest tests/test_config.py -v
```

Expected: PASS (3 tests)

**Step 6: Commit**

```bash
git add src/agentation/config.py tests/conftest.py tests/test_config.py
git commit -m "feat: add AgentationConfig dataclass with is_enabled logic"
```

---

### Task 2.2: Implement is_enabled Tests

**Files:**
- Modify: `tests/test_config.py`

**Step 1: Add is_enabled tests**

```python
# Add to tests/test_config.py

from agentation.config import is_enabled


def test_is_enabled_explicit_true():
    """Explicit enabled=True overrides everything."""
    config = AgentationConfig(enabled=True)
    assert is_enabled(config, framework_debug=False) is True


def test_is_enabled_explicit_false():
    """Explicit enabled=False overrides everything."""
    config = AgentationConfig(enabled=False)
    assert is_enabled(config, framework_debug=True) is False


def test_is_enabled_env_var_true(monkeypatch):
    """AGENTATION_ENABLED=true enables."""
    monkeypatch.setenv("AGENTATION_ENABLED", "true")
    config = AgentationConfig()
    assert is_enabled(config, framework_debug=False) is True


def test_is_enabled_env_var_false(monkeypatch):
    """AGENTATION_ENABLED=false disables."""
    monkeypatch.setenv("AGENTATION_ENABLED", "false")
    config = AgentationConfig()
    assert is_enabled(config, framework_debug=True) is False


def test_is_enabled_framework_debug():
    """Framework debug mode enables when no explicit config or env var."""
    config = AgentationConfig()
    assert is_enabled(config, framework_debug=True) is True
    assert is_enabled(config, framework_debug=False) is False


def test_is_enabled_default_false():
    """Default is False when nothing is set."""
    config = AgentationConfig()
    assert is_enabled(config) is False
```

**Step 2: Run tests**

```bash
pytest tests/test_config.py -v
```

Expected: PASS (9 tests)

**Step 3: Commit**

```bash
git add tests/test_config.py
git commit -m "test: add comprehensive is_enabled tests"
```

---

### Task 2.3: Implement Asset Loader

**Files:**
- Create: `src/agentation/assets.py`
- Create: `tests/test_assets.py`

**Step 1: Write test_assets.py**

```python
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
```

**Step 2: Run test to verify it fails**

```bash
pytest tests/test_assets.py -v
```

Expected: FAIL

**Step 3: Implement assets.py**

```python
"""Asset loading for Agentation."""

from __future__ import annotations

from functools import lru_cache
from importlib import resources


@lru_cache(maxsize=1)
def get_js_content() -> str:
    """Load the bundled JavaScript content."""
    # Use importlib.resources for proper package resource access
    try:
        # Python 3.11+
        files = resources.files("agentation")
        js_path = files.joinpath("static", "agentation.min.js")
        return js_path.read_text(encoding="utf-8")
    except (TypeError, AttributeError):
        # Fallback for older Python
        with resources.open_text("agentation.static", "agentation.min.js") as f:
            return f.read()
```

**Step 4: Create static __init__.py for resource discovery**

```python
# src/agentation/static/__init__.py
"""Static assets for Agentation."""
```

**Step 5: Run tests**

```bash
pytest tests/test_assets.py -v
```

Expected: PASS

**Step 6: Commit**

```bash
git add src/agentation/assets.py src/agentation/static/__init__.py tests/test_assets.py
git commit -m "feat: add asset loader for bundled JavaScript"
```

---

### Task 2.4: Implement HTML Injector

**Files:**
- Create: `src/agentation/injector.py`
- Create: `tests/test_injector.py`

**Step 1: Write test_injector.py**

```python
"""Tests for HTML injection."""

import json
import pytest
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
```

**Step 2: Run test to verify it fails**

```bash
pytest tests/test_injector.py -v
```

Expected: FAIL

**Step 3: Implement injector.py**

```python
"""HTML injection for Agentation."""

from __future__ import annotations

import json
from typing import Any

from agentation.assets import get_js_content
from agentation.config import AgentationConfig


def inject_agentation(
    html: str,
    config: AgentationConfig,
    route: str | None = None,
) -> str:
    """
    Inject Agentation JavaScript into HTML response.

    Args:
        html: The HTML content to inject into
        config: Agentation configuration
        route: Optional route/path for context in output

    Returns:
        Modified HTML with Agentation injected before </body>
    """
    # Find </body> tag (case-insensitive)
    body_close_lower = html.lower().find("</body>")
    if body_close_lower == -1:
        return html

    # Build config object for JavaScript
    js_config: dict[str, Any] = config.to_dict()
    if route and config.include_route:
        js_config["route"] = route

    # Build injection script
    js_content = get_js_content()
    config_json = json.dumps(js_config, separators=(",", ":"))

    injection = f"""<script>
window.__AGENTATION_CONFIG__ = {config_json};
{js_content}
</script>
"""

    # Find actual </body> position (preserve original case)
    body_close_pos = body_close_lower
    return html[:body_close_pos] + injection + html[body_close_pos:]
```

**Step 4: Update __init__.py exports**

```python
"""Agentation: Visual feedback tool for AI coding agents."""

__version__ = "0.1.0"

from agentation.config import AgentationConfig, is_enabled
from agentation.injector import inject_agentation

__all__ = [
    "AgentationConfig",
    "inject_agentation",
    "is_enabled",
    "__version__",
]
```

**Step 5: Run tests**

```bash
pytest tests/test_injector.py -v
```

Expected: PASS

**Step 6: Commit**

```bash
git add src/agentation/injector.py src/agentation/__init__.py tests/test_injector.py
git commit -m "feat: add HTML injector for Agentation script"
```

---

## Phase 3: Framework Adapters

### Task 3.1: Implement Flask Extension

**Files:**
- Create: `src/agentation/adapters/__init__.py`
- Create: `src/agentation/adapters/flask.py`
- Create: `tests/test_flask.py`

**Step 1: Write test_flask.py**

```python
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
```

**Step 2: Run test to verify it fails**

```bash
pytest tests/test_flask.py -v
```

Expected: FAIL

**Step 3: Create adapters/__init__.py**

```python
"""Framework adapters for Agentation."""

from agentation.adapters.flask import AgentationFlask

__all__ = ["AgentationFlask"]
```

**Step 4: Implement flask.py**

```python
"""Flask extension for Agentation."""

from __future__ import annotations

from typing import TYPE_CHECKING

from agentation.config import AgentationConfig, is_enabled
from agentation.injector import inject_agentation

if TYPE_CHECKING:
    from flask import Flask, Response


class AgentationFlask:
    """
    Flask extension for Agentation toolbar injection.

    Usage:
        app = Flask(__name__)
        AgentationFlask(app)

    Or with factory pattern:
        agentation = AgentationFlask()
        agentation.init_app(app)
    """

    def __init__(
        self,
        app: Flask | None = None,
        config: AgentationConfig | None = None,
    ) -> None:
        self.config = config or AgentationConfig()
        self._app: Flask | None = None

        if app is not None:
            self.init_app(app)

    def init_app(self, app: Flask) -> None:
        """Initialize extension with Flask app."""
        self._app = app

        if not is_enabled(self.config, framework_debug=app.debug):
            return

        app.after_request(self._inject)

        if not hasattr(app, "extensions"):
            app.extensions = {}
        app.extensions["agentation"] = self

    def _inject(self, response: Response) -> Response:
        """Inject Agentation into HTML responses."""
        content_type = response.content_type or ""

        if "text/html" not in content_type:
            return response

        # Import here to avoid circular imports
        from flask import request

        route = request.endpoint or request.path
        html = response.get_data(as_text=True)
        html = inject_agentation(html, self.config, route=route)
        response.set_data(html)

        return response
```

**Step 5: Update main __init__.py to export Flask adapter**

```python
"""Agentation: Visual feedback tool for AI coding agents."""

__version__ = "0.1.0"

from agentation.config import AgentationConfig, is_enabled
from agentation.injector import inject_agentation

__all__ = [
    "AgentationConfig",
    "inject_agentation",
    "is_enabled",
    "__version__",
]

# Lazy import for optional dependencies
def __getattr__(name: str):
    if name == "AgentationFlask":
        from agentation.adapters.flask import AgentationFlask
        return AgentationFlask
    raise AttributeError(f"module {__name__!r} has no attribute {name!r}")
```

**Step 6: Run tests**

```bash
pytest tests/test_flask.py -v
```

Expected: PASS

**Step 7: Commit**

```bash
git add src/agentation/adapters/ src/agentation/__init__.py tests/test_flask.py
git commit -m "feat: add Flask extension for Agentation injection"
```

---

### Task 3.2: Implement FastAPI Middleware

**Files:**
- Create: `src/agentation/adapters/fastapi.py`
- Create: `tests/test_fastapi.py`
- Modify: `src/agentation/adapters/__init__.py`

**Step 1: Write test_fastapi.py**

```python
"""Tests for FastAPI middleware."""

import os
import pytest
from fastapi import FastAPI
from fastapi.responses import HTMLResponse, JSONResponse
from httpx import AsyncClient, ASGITransport

from agentation import AgentationConfig
from agentation.adapters.fastapi import AgentationMiddleware


@pytest.fixture
def app():
    """Create test FastAPI app."""
    app = FastAPI()

    @app.get("/", response_class=HTMLResponse)
    async def index():
        return "<html><body><h1>Hello</h1></body></html>"

    @app.get("/json")
    async def json_route():
        return {"message": "hello"}

    return app


@pytest.mark.asyncio
async def test_fastapi_injects_when_enabled(app, monkeypatch):
    """Agentation is injected when AGENTATION_ENABLED=true."""
    monkeypatch.setenv("AGENTATION_ENABLED", "true")
    app.add_middleware(AgentationMiddleware)

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/")

    html = response.text
    assert "__AGENTATION_CONFIG__" in html
    assert "<script" in html


@pytest.mark.asyncio
async def test_fastapi_not_injected_when_disabled(app, monkeypatch):
    """Agentation is not injected when AGENTATION_ENABLED=false."""
    monkeypatch.setenv("AGENTATION_ENABLED", "false")
    app.add_middleware(AgentationMiddleware)

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/")

    html = response.text
    assert "__AGENTATION_CONFIG__" not in html


@pytest.mark.asyncio
async def test_fastapi_skips_non_html(app, monkeypatch):
    """Non-HTML responses are not modified."""
    monkeypatch.setenv("AGENTATION_ENABLED", "true")
    app.add_middleware(AgentationMiddleware)

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/json")

    assert response.json() == {"message": "hello"}


@pytest.mark.asyncio
async def test_fastapi_includes_route(app, monkeypatch):
    """Route path is included in config."""
    monkeypatch.setenv("AGENTATION_ENABLED", "true")
    app.add_middleware(AgentationMiddleware)

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/")

    html = response.text
    assert '"route":"/"' in html


@pytest.mark.asyncio
async def test_fastapi_custom_config(app, monkeypatch):
    """Custom config is applied."""
    monkeypatch.setenv("AGENTATION_ENABLED", "true")
    config = AgentationConfig(enabled=True, default_detail="forensic")
    app.add_middleware(AgentationMiddleware, config=config)

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/")

    html = response.text
    assert '"defaultDetail":"forensic"' in html
```

**Step 2: Run test to verify it fails**

```bash
pytest tests/test_fastapi.py -v
```

Expected: FAIL

**Step 3: Implement fastapi.py**

```python
"""FastAPI/Starlette middleware for Agentation."""

from __future__ import annotations

from typing import TYPE_CHECKING

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response

from agentation.config import AgentationConfig, is_enabled
from agentation.injector import inject_agentation

if TYPE_CHECKING:
    from starlette.requests import Request
    from starlette.types import ASGIApp


class AgentationMiddleware(BaseHTTPMiddleware):
    """
    Starlette/FastAPI middleware for Agentation toolbar injection.

    Usage:
        app = FastAPI()
        app.add_middleware(AgentationMiddleware)

    Or with custom config:
        config = AgentationConfig(default_detail="forensic")
        app.add_middleware(AgentationMiddleware, config=config)
    """

    def __init__(
        self,
        app: ASGIApp,
        config: AgentationConfig | None = None,
    ) -> None:
        super().__init__(app)
        self.config = config or AgentationConfig()
        self._enabled = is_enabled(self.config)

    async def dispatch(self, request: Request, call_next) -> Response:
        """Process request and inject Agentation if applicable."""
        response = await call_next(request)

        if not self._enabled:
            return response

        content_type = response.headers.get("content-type", "")
        if "text/html" not in content_type:
            return response

        # Read response body
        body = b""
        async for chunk in response.body_iterator:
            body += chunk

        html = body.decode("utf-8")
        route = request.url.path
        html = inject_agentation(html, self.config, route=route)

        return Response(
            content=html,
            status_code=response.status_code,
            headers=dict(response.headers),
            media_type="text/html",
        )
```

**Step 4: Update adapters/__init__.py**

```python
"""Framework adapters for Agentation."""

from agentation.adapters.flask import AgentationFlask
from agentation.adapters.fastapi import AgentationMiddleware

__all__ = ["AgentationFlask", "AgentationMiddleware"]
```

**Step 5: Update main __init__.py**

```python
"""Agentation: Visual feedback tool for AI coding agents."""

__version__ = "0.1.0"

from agentation.config import AgentationConfig, is_enabled
from agentation.injector import inject_agentation

__all__ = [
    "AgentationConfig",
    "inject_agentation",
    "is_enabled",
    "__version__",
]


def __getattr__(name: str):
    """Lazy import for optional dependencies."""
    if name == "AgentationFlask":
        from agentation.adapters.flask import AgentationFlask
        return AgentationFlask
    if name == "AgentationMiddleware":
        from agentation.adapters.fastapi import AgentationMiddleware
        return AgentationMiddleware
    raise AttributeError(f"module {__name__!r} has no attribute {name!r}")
```

**Step 6: Run tests**

```bash
pytest tests/test_fastapi.py -v
```

Expected: PASS

**Step 7: Commit**

```bash
git add src/agentation/adapters/fastapi.py src/agentation/adapters/__init__.py src/agentation/__init__.py tests/test_fastapi.py
git commit -m "feat: add FastAPI/Starlette middleware for Agentation injection"
```

---

## Phase 4: JavaScript Implementation (Core)

### Task 4.1: Implement Selector Engine

**Files:**
- Create: `src/js/selector-engine.js`

**Step 1: Implement selector-engine.js**

```javascript
/**
 * CSS Selector generation engine.
 * Generates optimal, grep-friendly selectors for elements.
 */

export class SelectorEngine {
  /**
   * Generate an optimal CSS selector for an element.
   * @param {Element} element - The DOM element
   * @returns {string} CSS selector
   */
  generate(element) {
    // 1. Try data-testid or data-element
    const testId = element.getAttribute('data-testid') || element.getAttribute('data-element');
    if (testId) {
      return `[data-testid="${testId}"]`;
    }

    // 2. Try unique ID
    if (element.id && this.isUnique(`#${CSS.escape(element.id)}`)) {
      return `#${CSS.escape(element.id)}`;
    }

    // 3. Try ARIA label
    const ariaLabel = element.getAttribute('aria-label');
    if (ariaLabel && this.isUnique(`[aria-label="${ariaLabel}"]`)) {
      return `[aria-label="${CSS.escape(ariaLabel)}"]`;
    }

    // 4. Try unique class combination
    const classSelector = this.findUniqueClasses(element);
    if (classSelector) {
      return classSelector;
    }

    // 5. Build structural path
    return this.buildPath(element);
  }

  /**
   * Check if a selector matches exactly one element.
   */
  isUnique(selector) {
    try {
      return document.querySelectorAll(selector).length === 1;
    } catch {
      return false;
    }
  }

  /**
   * Find a unique class combination for the element.
   */
  findUniqueClasses(element) {
    const classes = this.getCleanClasses(element);
    if (classes.length === 0) return null;

    // Try single classes first
    for (const cls of classes) {
      const selector = `.${CSS.escape(cls)}`;
      if (this.isUnique(selector)) {
        return selector;
      }
    }

    // Try class combinations (up to 3)
    for (let i = 2; i <= Math.min(3, classes.length); i++) {
      const combo = classes.slice(0, i).map(c => `.${CSS.escape(c)}`).join('');
      if (this.isUnique(combo)) {
        return combo;
      }
    }

    // Try with tag name
    const tag = element.tagName.toLowerCase();
    for (const cls of classes.slice(0, 2)) {
      const selector = `${tag}.${CSS.escape(cls)}`;
      if (this.isUnique(selector)) {
        return selector;
      }
    }

    // Try with parent context
    const parent = element.parentElement;
    if (parent) {
      const parentSelector = this.getSimpleSelector(parent);
      if (parentSelector) {
        const childClasses = classes.slice(0, 2).map(c => `.${CSS.escape(c)}`).join('');
        const combined = `${parentSelector} > ${tag}${childClasses}`;
        if (this.isUnique(combined)) {
          return combined;
        }
      }
    }

    return null;
  }

  /**
   * Get cleaned class names (remove CSS module hashes, short names).
   */
  getCleanClasses(element) {
    return Array.from(element.classList)
      .filter(cls => {
        // Remove very short classes
        if (cls.length <= 2) return false;
        // Remove CSS module hashes (pattern: _abc123 or abc_123abc)
        if (/^_[a-z0-9]+$/i.test(cls)) return false;
        if (/_[a-f0-9]{5,}$/i.test(cls)) return false;
        return true;
      });
  }

  /**
   * Get a simple selector for an element (for parent context).
   */
  getSimpleSelector(element) {
    if (element.id) {
      return `#${CSS.escape(element.id)}`;
    }
    const classes = this.getCleanClasses(element);
    if (classes.length > 0) {
      const tag = element.tagName.toLowerCase();
      return `${tag}.${CSS.escape(classes[0])}`;
    }
    return null;
  }

  /**
   * Build a structural path selector.
   */
  buildPath(element, maxDepth = 4) {
    const parts = [];
    let current = element;
    let depth = 0;

    while (current && current !== document.body && depth < maxDepth) {
      let part = current.tagName.toLowerCase();

      // Add first clean class if available
      const classes = this.getCleanClasses(current);
      if (classes.length > 0) {
        part += `.${CSS.escape(classes[0])}`;
      }

      // Add nth-child if siblings exist
      const parent = current.parentElement;
      if (parent) {
        const siblings = Array.from(parent.children).filter(
          c => c.tagName === current.tagName
        );
        if (siblings.length > 1) {
          const index = siblings.indexOf(current) + 1;
          part += `:nth-of-type(${index})`;
        }
      }

      parts.unshift(part);
      current = current.parentElement;
      depth++;
    }

    return parts.join(' > ');
  }

  /**
   * Get full DOM path (for forensic mode).
   */
  getFullPath(element) {
    const parts = [];
    let current = element;

    while (current && current !== document.documentElement) {
      let part = current.tagName.toLowerCase();

      if (current.id) {
        part += `#${CSS.escape(current.id)}`;
      } else {
        const classes = this.getCleanClasses(current);
        if (classes.length > 0) {
          part += `.${CSS.escape(classes[0])}`;
        }
      }

      parts.unshift(part);
      current = current.parentElement;
    }

    parts.unshift('html');
    return parts.join(' > ');
  }
}
```

**Step 2: Commit**

```bash
git add src/js/selector-engine.js
git commit -m "feat(js): implement CSS selector generation engine"
```

---

### Task 4.2: Implement Element Identification

**Files:**
- Create: `src/js/element-identification.js`

**Step 1: Implement element-identification.js**

```javascript
/**
 * Element identification utilities.
 * Generates human-readable names and extracts metadata.
 */

import { SelectorEngine } from './selector-engine.js';

const selectorEngine = new SelectorEngine();

/**
 * Identify an element with a human-readable name.
 * @param {Element} element
 * @returns {string}
 */
export function identifyElement(element) {
  const tag = element.tagName.toLowerCase();

  // Check for explicit naming
  const dataElement = element.getAttribute('data-element');
  if (dataElement) {
    return dataElement;
  }

  // SVG elements
  if (element instanceof SVGElement || tag === 'svg') {
    const parent = element.closest('button, a, [role="button"]');
    if (parent) {
      return `icon in ${identifyElement(parent)}`;
    }
    return 'graphic';
  }

  // Get text content (cleaned)
  const text = getElementText(element);

  // Buttons
  if (tag === 'button' || element.getAttribute('role') === 'button') {
    return text ? `button "${truncate(text, 25)}"` : 'button';
  }

  // Links
  if (tag === 'a') {
    if (text) return `link "${truncate(text, 25)}"`;
    const href = element.getAttribute('href');
    if (href) return `link to "${truncate(href, 30)}"`;
    return 'link';
  }

  // Inputs
  if (tag === 'input') {
    const type = element.getAttribute('type') || 'text';
    const placeholder = element.getAttribute('placeholder');
    const name = element.getAttribute('name');
    const label = placeholder || name || type;
    return `input "${truncate(label, 20)}"`;
  }

  // Textareas
  if (tag === 'textarea') {
    const placeholder = element.getAttribute('placeholder');
    const name = element.getAttribute('name');
    return `textarea "${truncate(placeholder || name || '', 20)}"`;
  }

  // Selects
  if (tag === 'select') {
    const name = element.getAttribute('name');
    return name ? `select "${truncate(name, 20)}"` : 'select';
  }

  // Images
  if (tag === 'img') {
    const alt = element.getAttribute('alt');
    return alt ? `image "${truncate(alt, 25)}"` : 'image';
  }

  // Headings
  if (/^h[1-6]$/.test(tag)) {
    return text ? `${tag} "${truncate(text, 35)}"` : tag;
  }

  // Paragraphs
  if (tag === 'p') {
    return text ? `paragraph: "${truncate(text, 40)}..."` : 'paragraph';
  }

  // Labels
  if (tag === 'label') {
    return text ? `label "${truncate(text, 25)}"` : 'label';
  }

  // Semantic containers
  if (['section', 'article', 'nav', 'header', 'footer', 'main', 'aside'].includes(tag)) {
    const ariaLabel = element.getAttribute('aria-label');
    if (ariaLabel) return `${tag} "${truncate(ariaLabel, 25)}"`;
    return tag;
  }

  // Divs and spans - try to find meaningful identifier
  if (tag === 'div' || tag === 'span') {
    const classes = selectorEngine.getCleanClasses(element);
    if (classes.length > 0) {
      return `${tag}.${classes[0]}`;
    }
    return tag;
  }

  // Default: tag with optional class
  const classes = selectorEngine.getCleanClasses(element);
  if (classes.length > 0) {
    return `${tag}.${classes[0]}`;
  }

  return tag;
}

/**
 * Get clean text content from element.
 */
function getElementText(element) {
  // Get direct text, not from children
  let text = '';
  for (const node of element.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      text += node.textContent;
    }
  }
  text = text.trim();

  // Fallback to textContent for simple elements
  if (!text && element.childElementCount === 0) {
    text = element.textContent?.trim() || '';
  }

  return text;
}

/**
 * Truncate string with ellipsis.
 */
function truncate(str, maxLen) {
  if (!str) return '';
  str = str.trim().replace(/\s+/g, ' ');
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 3) + '...';
}

/**
 * Get element's CSS classes (cleaned).
 */
export function getElementClasses(element) {
  return selectorEngine.getCleanClasses(element);
}

/**
 * Get element's CSS path.
 */
export function getElementPath(element) {
  return selectorEngine.generate(element);
}

/**
 * Get full DOM path (forensic mode).
 */
export function getFullElementPath(element) {
  return selectorEngine.getFullPath(element);
}

/**
 * Get nearby text context.
 */
export function getNearbyText(element) {
  const parts = [];

  // Own text
  const ownText = element.textContent?.trim();
  if (ownText && ownText.length < 100) {
    parts.push(ownText);
  }

  // Previous sibling text
  const prev = element.previousElementSibling;
  if (prev) {
    const prevText = prev.textContent?.trim();
    if (prevText && prevText.length < 50) {
      parts.unshift(prevText);
    }
  }

  // Next sibling text
  const next = element.nextElementSibling;
  if (next) {
    const nextText = next.textContent?.trim();
    if (nextText && nextText.length < 50) {
      parts.push(nextText);
    }
  }

  return parts.join(' | ');
}

/**
 * Get nearby elements description.
 */
export function getNearbyElements(element) {
  const parent = element.parentElement;
  if (!parent) return '';

  const siblings = Array.from(parent.children)
    .filter(c => c !== element)
    .slice(0, 4)
    .map(c => identifyElement(c));

  if (siblings.length === 0) return '';

  return siblings.join(', ');
}

/**
 * Get accessibility information.
 */
export function getAccessibilityInfo(element) {
  const info = [];

  const role = element.getAttribute('role');
  if (role) info.push(`role="${role}"`);

  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel) info.push(`aria-label="${ariaLabel}"`);

  const ariaDescribedby = element.getAttribute('aria-describedby');
  if (ariaDescribedby) info.push(`aria-describedby="${ariaDescribedby}"`);

  const tabindex = element.getAttribute('tabindex');
  if (tabindex !== null) info.push(`tabindex="${tabindex}"`);

  const ariaHidden = element.getAttribute('aria-hidden');
  if (ariaHidden) info.push(`aria-hidden="${ariaHidden}"`);

  // Check focusability
  const focusable = element.matches(
    'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  if (focusable) info.push('focusable');

  return info.join(', ');
}

/**
 * Get key computed styles (for detailed/forensic modes).
 */
export function getComputedStyles(element) {
  const computed = window.getComputedStyle(element);
  const styles = {};

  // Colors
  styles.color = computed.color;
  styles.backgroundColor = computed.backgroundColor;

  // Typography
  styles.fontSize = computed.fontSize;
  styles.fontWeight = computed.fontWeight;
  styles.fontFamily = computed.fontFamily;

  // Layout
  styles.display = computed.display;
  styles.position = computed.position;

  // Box model
  styles.padding = computed.padding;
  styles.margin = computed.margin;

  return styles;
}

/**
 * Check if element has fixed/sticky positioning.
 */
export function isElementFixed(element) {
  let current = element;
  while (current && current !== document.body) {
    const position = window.getComputedStyle(current).position;
    if (position === 'fixed' || position === 'sticky') {
      return true;
    }
    current = current.parentElement;
  }
  return false;
}
```

**Step 2: Commit**

```bash
git add src/js/element-identification.js
git commit -m "feat(js): implement element identification utilities"
```

---

### Task 4.3: Implement Storage Module

**Files:**
- Create: `src/js/storage.js`

**Step 1: Implement storage.js**

```javascript
/**
 * LocalStorage persistence for annotations.
 * Per-page storage with 7-day retention.
 */

const STORAGE_PREFIX = 'agentation-annotations-';
const RETENTION_DAYS = 7;

/**
 * Get storage key for current page.
 */
function getStorageKey() {
  return STORAGE_PREFIX + window.location.pathname;
}

/**
 * Load annotations from localStorage.
 * Filters out annotations older than RETENTION_DAYS.
 * @returns {Array} Annotations array
 */
export function loadAnnotations() {
  try {
    const key = getStorageKey();
    const stored = localStorage.getItem(key);
    if (!stored) return [];

    const annotations = JSON.parse(stored);
    const now = Date.now();
    const maxAge = RETENTION_DAYS * 24 * 60 * 60 * 1000;

    // Filter out old annotations
    const valid = annotations.filter(a => {
      return a.timestamp && (now - a.timestamp) < maxAge;
    });

    // Save filtered list if any were removed
    if (valid.length !== annotations.length) {
      saveAnnotations(valid);
    }

    return valid;
  } catch (e) {
    console.warn('Agentation: Failed to load annotations', e);
    return [];
  }
}

/**
 * Save annotations to localStorage.
 * @param {Array} annotations
 */
export function saveAnnotations(annotations) {
  try {
    const key = getStorageKey();
    if (annotations.length === 0) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(annotations));
    }
  } catch (e) {
    console.warn('Agentation: Failed to save annotations', e);
  }
}

/**
 * Clear all annotations for current page.
 */
export function clearAnnotations() {
  try {
    const key = getStorageKey();
    localStorage.removeItem(key);
  } catch (e) {
    console.warn('Agentation: Failed to clear annotations', e);
  }
}

/**
 * Load settings from localStorage.
 * @returns {Object} Settings object
 */
export function loadSettings() {
  try {
    const stored = localStorage.getItem('agentation-settings');
    if (!stored) return {};
    return JSON.parse(stored);
  } catch {
    return {};
  }
}

/**
 * Save settings to localStorage.
 * @param {Object} settings
 */
export function saveSettings(settings) {
  try {
    localStorage.setItem('agentation-settings', JSON.stringify(settings));
  } catch (e) {
    console.warn('Agentation: Failed to save settings', e);
  }
}
```

**Step 2: Commit**

```bash
git add src/js/storage.js
git commit -m "feat(js): implement localStorage persistence for annotations"
```

---

### Task 4.4: Implement Annotations Manager

**Files:**
- Create: `src/js/annotations.js`

**Step 1: Implement annotations.js**

```javascript
/**
 * Annotation data management.
 */

import {
  identifyElement,
  getElementPath,
  getFullElementPath,
  getElementClasses,
  getNearbyText,
  getNearbyElements,
  getAccessibilityInfo,
  getComputedStyles,
  isElementFixed,
} from './element-identification.js';
import { loadAnnotations, saveAnnotations, clearAnnotations as storageClear } from './storage.js';

let annotations = [];
let idCounter = 0;

/**
 * Initialize annotations from storage.
 */
export function initAnnotations() {
  annotations = loadAnnotations();
  // Set counter to max existing id + 1
  idCounter = annotations.reduce((max, a) => {
    const num = parseInt(a.id.split('-')[1] || '0', 10);
    return Math.max(max, num);
  }, 0) + 1;
}

/**
 * Create annotation for an element.
 * @param {Element} element
 * @param {string} comment - User feedback
 * @param {string} selectedText - User-selected text
 * @param {boolean} isMultiSelect - Part of multi-select
 * @returns {Object} Annotation object
 */
export function createAnnotation(element, comment, selectedText = '', isMultiSelect = false) {
  const rect = element.getBoundingClientRect();
  const scrollY = window.scrollY;
  const scrollX = window.scrollX;
  const isFixed = isElementFixed(element);

  const annotation = {
    id: `ann-${idCounter++}`,
    timestamp: Date.now(),

    // Position (percentage for x, pixels for y)
    x: ((rect.left + rect.width / 2) / window.innerWidth) * 100,
    y: isFixed ? rect.top + rect.height / 2 : rect.top + rect.height / 2 + scrollY,

    // Core data
    element: identifyElement(element),
    elementPath: getElementPath(element),
    comment: comment,

    // Optional data
    selectedText: selectedText ? selectedText.slice(0, 500) : undefined,
    boundingBox: {
      x: Math.round(rect.left + scrollX),
      y: Math.round(rect.top + scrollY),
      width: Math.round(rect.width),
      height: Math.round(rect.height),
    },

    // Extended data (for detailed/forensic modes)
    cssClasses: getElementClasses(element).join(' ') || undefined,
    nearbyText: getNearbyText(element) || undefined,
    nearbyElements: getNearbyElements(element) || undefined,
    fullPath: getFullElementPath(element),
    accessibility: getAccessibilityInfo(element) || undefined,
    computedStyles: formatComputedStyles(getComputedStyles(element)),

    // Flags
    isMultiSelect: isMultiSelect || undefined,
    isFixed: isFixed || undefined,
  };

  annotations.push(annotation);
  saveAnnotations(annotations);

  return annotation;
}

/**
 * Format computed styles as string.
 */
function formatComputedStyles(styles) {
  return Object.entries(styles)
    .filter(([, v]) => v && v !== 'none' && v !== 'normal' && v !== 'auto')
    .map(([k, v]) => `${k}: ${v}`)
    .join('; ');
}

/**
 * Get all annotations.
 */
export function getAnnotations() {
  return [...annotations];
}

/**
 * Remove annotation by ID.
 */
export function removeAnnotation(id) {
  annotations = annotations.filter(a => a.id !== id);
  saveAnnotations(annotations);
}

/**
 * Clear all annotations.
 */
export function clearAllAnnotations() {
  annotations = [];
  storageClear();
}

/**
 * Get annotation count.
 */
export function getAnnotationCount() {
  return annotations.length;
}
```

**Step 2: Commit**

```bash
git add src/js/annotations.js
git commit -m "feat(js): implement annotations manager"
```

---

### Task 4.5: Implement Output Formatter

**Files:**
- Create: `src/js/output-formatter.js`

**Step 1: Implement output-formatter.js**

```javascript
/**
 * Output formatting for annotations.
 * Supports Markdown and JSON in 4 detail levels.
 */

/**
 * Format annotations for output.
 * @param {Array} annotations
 * @param {Object} options - { detail: 'compact'|'standard'|'detailed'|'forensic', format: 'markdown'|'json', route: string }
 * @returns {string}
 */
export function formatOutput(annotations, options = {}) {
  const { detail = 'standard', format = 'markdown', route = null } = options;

  if (format === 'json') {
    return formatJSON(annotations, detail, route);
  }

  return formatMarkdown(annotations, detail, route);
}

/**
 * Format as Markdown.
 */
function formatMarkdown(annotations, detail, route) {
  if (annotations.length === 0) {
    return '# No annotations\n\nNo elements have been annotated.';
  }

  // Compact mode - minimal output
  if (detail === 'compact') {
    return formatCompact(annotations);
  }

  const lines = [];

  // Header
  if (route) {
    lines.push(`## Page Feedback: ${route}`);
  } else {
    lines.push('## Page Feedback');
  }

  lines.push(`**Viewport:** ${window.innerWidth}x${window.innerHeight}`);

  // Forensic mode header extras
  if (detail === 'forensic') {
    lines.push(`**URL:** ${window.location.href}`);
    lines.push(`**User Agent:** ${navigator.userAgent}`);
    lines.push(`**Device Pixel Ratio:** ${window.devicePixelRatio}`);
  }

  lines.push('');

  // Annotations
  annotations.forEach((ann, i) => {
    lines.push(`### ${i + 1}. ${ann.element}`);
    lines.push('');

    // Standard fields
    if (detail === 'forensic' && ann.fullPath) {
      lines.push(`**Full DOM Path:** ${ann.fullPath}`);
    } else {
      lines.push(`**Location:** \`${ann.elementPath}\``);
    }

    // Detailed and forensic: classes
    if ((detail === 'detailed' || detail === 'forensic') && ann.cssClasses) {
      lines.push(`**Classes:** ${ann.cssClasses}`);
    }

    // Detailed and forensic: position
    if ((detail === 'detailed' || detail === 'forensic') && ann.boundingBox) {
      const bb = ann.boundingBox;
      if (detail === 'forensic') {
        lines.push(`**Position:** x:${bb.x}, y:${bb.y} (${bb.width}×${bb.height}px)`);
        lines.push(`**Annotation at:** ${ann.x.toFixed(1)}% from left, ${Math.round(ann.y)}px from top`);
      } else {
        lines.push(`**Position:** ${bb.x}px, ${bb.y}px (${bb.width}×${bb.height}px)`);
      }
    }

    // Selected text
    if (ann.selectedText) {
      lines.push(`**Selected text:** "${ann.selectedText}"`);
    }

    // Forensic: computed styles
    if (detail === 'forensic' && ann.computedStyles) {
      lines.push(`**Computed Styles:** ${ann.computedStyles}`);
    }

    // Forensic: accessibility
    if (detail === 'forensic' && ann.accessibility) {
      lines.push(`**Accessibility:** ${ann.accessibility}`);
    }

    // Detailed and forensic: nearby context
    if ((detail === 'detailed' || detail === 'forensic') && ann.nearbyText) {
      lines.push(`**Context:** "${ann.nearbyText}"`);
    }

    // Forensic: nearby elements
    if (detail === 'forensic' && ann.nearbyElements) {
      lines.push(`**Nearby Elements:** ${ann.nearbyElements}`);
    }

    // Feedback (always)
    lines.push(`**Feedback:** ${ann.comment || '(no feedback provided)'}`);
    lines.push('');
  });

  return lines.join('\n');
}

/**
 * Format compact mode - minimal output.
 */
function formatCompact(annotations) {
  return annotations
    .map((ann, i) => `${i + 1}. ${ann.element}: ${ann.comment || '(no feedback)'}`)
    .join('\n');
}

/**
 * Format as JSON.
 */
function formatJSON(annotations, detail, route) {
  const output = {
    route: route || window.location.pathname,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    annotations: annotations.map(ann => formatAnnotationJSON(ann, detail)),
  };

  // Forensic extras
  if (detail === 'forensic') {
    output.url = window.location.href;
    output.userAgent = navigator.userAgent;
    output.devicePixelRatio = window.devicePixelRatio;
    output.timestamp = Date.now();
  }

  return JSON.stringify(output, null, 2);
}

/**
 * Format single annotation for JSON.
 */
function formatAnnotationJSON(ann, detail) {
  const base = {
    element: ann.element,
    location: ann.elementPath,
    feedback: ann.comment || null,
  };

  if (ann.selectedText) {
    base.selectedText = ann.selectedText;
  }

  // Standard: add nothing extra

  // Detailed: add classes, position
  if (detail === 'detailed' || detail === 'forensic') {
    if (ann.cssClasses) {
      base.classes = ann.cssClasses.split(' ');
    }
    if (ann.boundingBox) {
      base.position = ann.boundingBox;
    }
    if (ann.nearbyText) {
      base.context = ann.nearbyText;
    }
  }

  // Forensic: add everything
  if (detail === 'forensic') {
    if (ann.fullPath) {
      base.fullDOMPath = ann.fullPath;
    }
    if (ann.computedStyles) {
      base.computedStyles = ann.computedStyles;
    }
    if (ann.accessibility) {
      base.accessibility = ann.accessibility;
    }
    if (ann.nearbyElements) {
      base.nearbyElements = ann.nearbyElements;
    }
    base.annotationPosition = {
      xPercent: ann.x,
      yPixels: ann.y,
    };
    base.timestamp = ann.timestamp;
    base.isFixed = ann.isFixed || false;
    base.isMultiSelect = ann.isMultiSelect || false;
  }

  return base;
}

/**
 * Copy text to clipboard.
 * @param {string} text
 * @returns {Promise<boolean>}
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    console.warn('Agentation: Clipboard write failed', e);
    // Fallback for older browsers
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return true;
    } catch {
      return false;
    }
  }
}
```

**Step 2: Commit**

```bash
git add src/js/output-formatter.js
git commit -m "feat(js): implement output formatter for Markdown and JSON"
```

---

### Task 4.6: Implement Styles

**Files:**
- Create: `src/js/styles.js`

**Step 1: Implement styles.js**

```javascript
/**
 * Styles for Agentation toolbar and markers.
 */

export const STYLES = `
/* Agentation Toolbar */
.agentation-toolbar {
  position: fixed;
  z-index: 2147483647;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
  line-height: 1.4;
  box-sizing: border-box;
}

.agentation-toolbar *,
.agentation-toolbar *::before,
.agentation-toolbar *::after {
  box-sizing: border-box;
}

/* Toolbar inner container */
.agentation-toolbar-inner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--agentation-bg, #1f2937);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  transition: all 0.2s ease;
}

/* Collapsed state */
.agentation-toolbar.collapsed .agentation-toolbar-inner {
  padding: 0;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  justify-content: center;
  cursor: pointer;
}

.agentation-toolbar.collapsed .agentation-controls {
  display: none;
}

/* Buttons */
.agentation-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--agentation-text, #f3f4f6);
  cursor: pointer;
  transition: all 0.15s ease;
}

.agentation-btn:hover {
  background: var(--agentation-hover, #374151);
}

.agentation-btn.active {
  background: var(--agentation-accent, #3b82f6);
}

.agentation-btn svg {
  width: 18px;
  height: 18px;
}

/* Badge (collapsed state) */
.agentation-badge {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.agentation-badge-count {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  background: var(--agentation-accent, #3b82f6);
  border-radius: 9px;
  font-size: 11px;
  font-weight: 600;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Controls section */
.agentation-controls {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Annotation count */
.agentation-count {
  min-width: 28px;
  padding: 4px 8px;
  background: var(--agentation-accent, #3b82f6);
  border-radius: 14px;
  font-size: 12px;
  font-weight: 600;
  color: white;
  text-align: center;
}

/* Divider */
.agentation-divider {
  width: 1px;
  height: 20px;
  background: var(--agentation-border, #4b5563);
  margin: 0 4px;
}

/* Markers */
.agentation-marker {
  position: absolute;
  width: 24px;
  height: 24px;
  margin-left: -12px;
  margin-top: -12px;
  border-radius: 50%;
  background: var(--agentation-accent, #3b82f6);
  color: white;
  font-size: 12px;
  font-weight: 600;
  font-family: system-ui, -apple-system, sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2147483646;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.15s ease;
  pointer-events: auto;
}

.agentation-marker:hover {
  transform: scale(1.15);
}

.agentation-marker.multi-select {
  background: #10b981;
}

/* Fixed markers container */
.agentation-markers-fixed {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2147483645;
}

/* Scrolling markers container */
.agentation-markers-scroll {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  pointer-events: none;
  z-index: 2147483644;
}

/* Hover highlight */
[data-agentation-highlight] {
  outline: 2px solid var(--agentation-accent, #3b82f6) !important;
  outline-offset: 2px !important;
}

/* Popup */
.agentation-popup {
  position: fixed;
  z-index: 2147483647;
  padding: 12px;
  background: var(--agentation-bg, #1f2937);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  font-family: system-ui, -apple-system, sans-serif;
}

.agentation-popup-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  color: var(--agentation-text, #f3f4f6);
  font-size: 12px;
  opacity: 0.8;
}

.agentation-popup-input {
  width: 300px;
  min-height: 60px;
  padding: 10px;
  border: 1px solid var(--agentation-border, #4b5563);
  border-radius: 8px;
  background: transparent;
  color: var(--agentation-text, #f3f4f6);
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
}

.agentation-popup-input:focus {
  outline: none;
  border-color: var(--agentation-accent, #3b82f6);
}

.agentation-popup-hint {
  margin-top: 8px;
  font-size: 11px;
  color: var(--agentation-text, #f3f4f6);
  opacity: 0.6;
}

/* Drag selection box */
.agentation-drag-box {
  position: fixed;
  border: 2px dashed var(--agentation-accent, #3b82f6);
  background: rgba(59, 130, 246, 0.1);
  pointer-events: none;
  z-index: 2147483646;
}

/* Drag highlight */
.agentation-drag-highlight {
  position: absolute;
  background: rgba(59, 130, 246, 0.2);
  border: 2px solid var(--agentation-accent, #3b82f6);
  pointer-events: none;
  z-index: 2147483645;
}

/* Theme: Light mode */
.agentation-toolbar.light {
  --agentation-bg: #ffffff;
  --agentation-text: #1f2937;
  --agentation-hover: #f3f4f6;
  --agentation-border: #d1d5db;
}

.agentation-popup.light {
  --agentation-bg: #ffffff;
  --agentation-text: #1f2937;
  --agentation-border: #d1d5db;
}

/* Auto theme */
@media (prefers-color-scheme: light) {
  .agentation-toolbar.auto,
  .agentation-popup.auto {
    --agentation-bg: #ffffff;
    --agentation-text: #1f2937;
    --agentation-hover: #f3f4f6;
    --agentation-border: #d1d5db;
  }
}

/* Animation: Entrance */
@keyframes agentation-scale-in {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.agentation-toolbar {
  animation: agentation-scale-in 0.2s ease-out;
}

.agentation-marker {
  animation: agentation-scale-in 0.15s ease-out;
}

/* Animation: Popup shake */
@keyframes agentation-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}

.agentation-popup.shake {
  animation: agentation-shake 0.3s ease-in-out;
}

/* Block interactions mode */
body.agentation-blocking * {
  cursor: crosshair !important;
}

body.agentation-blocking .agentation-toolbar,
body.agentation-blocking .agentation-toolbar *,
body.agentation-blocking .agentation-popup,
body.agentation-blocking .agentation-popup *,
body.agentation-blocking .agentation-marker {
  cursor: default !important;
}
`;

/**
 * Inject styles into document.
 */
export function injectStyles() {
  if (document.getElementById('agentation-styles')) {
    return;
  }

  const style = document.createElement('style');
  style.id = 'agentation-styles';
  style.textContent = STYLES;
  document.head.appendChild(style);
}
```

**Step 2: Commit**

```bash
git add src/js/styles.js
git commit -m "feat(js): add CSS styles for toolbar, markers, and popup"
```

---

### Task 4.7: Implement Icons

**Files:**
- Create: `src/js/icons.js`

**Step 1: Implement icons.js**

```javascript
/**
 * SVG icons for Agentation toolbar.
 */

export const icons = {
  // Agentation logo/badge
  logo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 16v-4"/>
    <path d="M12 8h.01"/>
  </svg>`,

  // Pause animations
  pause: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="6" y="4" width="4" height="16"/>
    <rect x="14" y="4" width="4" height="16"/>
  </svg>`,

  // Play/resume animations
  play: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>`,

  // Eye (show markers)
  eye: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>`,

  // Eye off (hide markers)
  eyeOff: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>`,

  // Copy to clipboard
  copy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>`,

  // Check (copy success)
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>`,

  // Trash (clear)
  trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>`,

  // Settings gear
  settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>`,

  // Close X
  close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>`,

  // Chevron down
  chevronDown: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>`,
};
```

**Step 2: Commit**

```bash
git add src/js/icons.js
git commit -m "feat(js): add SVG icons for toolbar UI"
```

---

### Task 4.8: Implement Popup Component

**Files:**
- Create: `src/js/popup.js`

**Step 1: Implement popup.js**

```javascript
/**
 * Annotation popup component.
 */

/**
 * Show annotation popup near element.
 * @param {Element} element - The annotated element
 * @param {string} elementName - Human-readable element name
 * @param {Function} onSubmit - Callback with (comment) when submitted
 * @param {Function} onCancel - Callback when cancelled
 * @param {Object} options - { theme, accentColor }
 */
export function showPopup(element, elementName, onSubmit, onCancel, options = {}) {
  const { theme = 'dark', accentColor = '#3b82f6' } = options;

  // Remove any existing popup
  hidePopup();

  const rect = element.getBoundingClientRect();

  // Create popup
  const popup = document.createElement('div');
  popup.className = `agentation-popup ${theme}`;
  popup.style.setProperty('--agentation-accent', accentColor);

  // Position popup below element, or above if near bottom
  let top = rect.bottom + 8;
  let left = rect.left;

  // Adjust if too close to bottom
  if (top + 150 > window.innerHeight) {
    top = rect.top - 150 - 8;
  }

  // Adjust if too close to right edge
  if (left + 324 > window.innerWidth) {
    left = window.innerWidth - 324 - 16;
  }

  // Adjust if too close to left edge
  if (left < 16) {
    left = 16;
  }

  popup.style.top = `${top}px`;
  popup.style.left = `${left}px`;

  popup.innerHTML = `
    <div class="agentation-popup-header">
      Annotating: ${escapeHtml(elementName)}
    </div>
    <textarea
      class="agentation-popup-input"
      placeholder="What's the issue with this element?"
      autofocus
    ></textarea>
    <div class="agentation-popup-hint">
      Enter to save · Shift+Enter for new line · Escape to cancel
    </div>
  `;

  document.body.appendChild(popup);

  const textarea = popup.querySelector('textarea');
  textarea.focus();

  // Handle keyboard
  const handleKeydown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const comment = textarea.value.trim();
      hidePopup();
      onSubmit(comment);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      hidePopup();
      onCancel();
    }
  };

  textarea.addEventListener('keydown', handleKeydown);

  // Handle click outside
  const handleClickOutside = (e) => {
    if (!popup.contains(e.target)) {
      // Shake if there's content
      if (textarea.value.trim()) {
        popup.classList.add('shake');
        setTimeout(() => popup.classList.remove('shake'), 300);
      } else {
        hidePopup();
        onCancel();
      }
    }
  };

  // Delay to avoid immediate trigger
  setTimeout(() => {
    document.addEventListener('mousedown', handleClickOutside);
  }, 100);

  // Store cleanup function
  popup._cleanup = () => {
    textarea.removeEventListener('keydown', handleKeydown);
    document.removeEventListener('mousedown', handleClickOutside);
  };
}

/**
 * Hide and cleanup popup.
 */
export function hidePopup() {
  const popup = document.querySelector('.agentation-popup');
  if (popup) {
    if (popup._cleanup) {
      popup._cleanup();
    }
    popup.remove();
  }
}

/**
 * Check if popup is currently visible.
 */
export function isPopupVisible() {
  return !!document.querySelector('.agentation-popup');
}

/**
 * Escape HTML special characters.
 */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
```

**Step 2: Commit**

```bash
git add src/js/popup.js
git commit -m "feat(js): implement annotation popup component"
```

---

### Task 4.9: Implement Keyboard Handler

**Files:**
- Create: `src/js/keyboard.js`

**Step 1: Implement keyboard.js**

```javascript
/**
 * Keyboard shortcut handling.
 */

const handlers = new Map();
let initialized = false;

/**
 * Parse shortcut string into key combo.
 * @param {string} shortcut - e.g., "ctrl+shift+a"
 * @returns {Object} { key, ctrl, shift, alt, meta }
 */
function parseShortcut(shortcut) {
  const parts = shortcut.toLowerCase().split('+');
  return {
    key: parts[parts.length - 1],
    ctrl: parts.includes('ctrl'),
    shift: parts.includes('shift'),
    alt: parts.includes('alt'),
    meta: parts.includes('meta') || parts.includes('cmd'),
  };
}

/**
 * Check if event matches shortcut.
 */
function matchesShortcut(event, shortcut) {
  const parsed = parseShortcut(shortcut);

  const keyMatches = event.key.toLowerCase() === parsed.key;
  const ctrlMatches = event.ctrlKey === parsed.ctrl;
  const shiftMatches = event.shiftKey === parsed.shift;
  const altMatches = event.altKey === parsed.alt;
  const metaMatches = event.metaKey === parsed.meta;

  return keyMatches && ctrlMatches && shiftMatches && altMatches && metaMatches;
}

/**
 * Global keydown handler.
 */
function handleKeydown(event) {
  for (const [shortcut, handler] of handlers) {
    if (matchesShortcut(event, shortcut)) {
      event.preventDefault();
      event.stopPropagation();
      handler();
      return;
    }
  }
}

/**
 * Initialize keyboard handler.
 */
function init() {
  if (initialized) return;
  document.addEventListener('keydown', handleKeydown, true);
  initialized = true;
}

/**
 * Register a keyboard shortcut.
 * @param {string} shortcut - e.g., "ctrl+shift+a"
 * @param {Function} handler
 */
export function registerShortcut(shortcut, handler) {
  init();
  handlers.set(shortcut.toLowerCase(), handler);
}

/**
 * Unregister a keyboard shortcut.
 * @param {string} shortcut
 */
export function unregisterShortcut(shortcut) {
  handlers.delete(shortcut.toLowerCase());
}

/**
 * Clear all shortcuts.
 */
export function clearShortcuts() {
  handlers.clear();
}
```

**Step 2: Commit**

```bash
git add src/js/keyboard.js
git commit -m "feat(js): implement keyboard shortcut handler"
```

---

### Task 4.10: Implement Main Toolbar

**Files:**
- Create: `src/js/toolbar.js`
- Modify: `src/js/index.js`

**Step 1: Implement toolbar.js**

```javascript
/**
 * Main Agentation toolbar component.
 */

import { icons } from './icons.js';
import { injectStyles } from './styles.js';
import {
  initAnnotations,
  createAnnotation,
  getAnnotations,
  clearAllAnnotations,
  getAnnotationCount,
} from './annotations.js';
import { formatOutput, copyToClipboard } from './output-formatter.js';
import { showPopup, hidePopup, isPopupVisible } from './popup.js';
import { registerShortcut } from './keyboard.js';
import { identifyElement } from './element-identification.js';
import { loadSettings, saveSettings } from './storage.js';

let toolbar = null;
let markersContainer = null;
let isActive = false;
let isCollapsed = true;
let hoveredElement = null;
let settings = {};
let config = {};

/**
 * Initialize Agentation toolbar.
 * @param {Object} cfg - Configuration from Python
 */
export function initToolbar(cfg = {}) {
  config = cfg;

  // Load persisted settings
  settings = {
    detail: cfg.defaultDetail || 'standard',
    format: cfg.defaultFormat || 'markdown',
    theme: cfg.theme || 'auto',
    accentColor: cfg.accentColor || '#3b82f6',
    blockInteractions: cfg.blockInteractions !== false,
    autoClearOnCopy: cfg.autoClearOnCopy || false,
    markersVisible: true,
    ...loadSettings(),
  };

  injectStyles();
  initAnnotations();
  createToolbar();
  createMarkersContainer();
  setupEventListeners();
  renderMarkers();

  // Register keyboard shortcut
  const shortcut = cfg.keyboardShortcut || 'ctrl+shift+a';
  registerShortcut(shortcut, toggleActive);
}

/**
 * Create toolbar DOM element.
 */
function createToolbar() {
  toolbar = document.createElement('div');
  toolbar.className = `agentation-toolbar collapsed ${settings.theme}`;
  toolbar.style.setProperty('--agentation-accent', settings.accentColor);

  // Position
  const pos = config.position || 'bottom-right';
  const [vertical, horizontal] = pos.split('-');
  toolbar.style[vertical] = '16px';
  toolbar.style[horizontal] = '16px';

  updateToolbarContent();
  document.body.appendChild(toolbar);
}

/**
 * Update toolbar HTML content.
 */
function updateToolbarContent() {
  const count = getAnnotationCount();

  toolbar.innerHTML = `
    <div class="agentation-toolbar-inner">
      ${isCollapsed ? `
        <div class="agentation-badge">
          ${icons.logo}
          ${count > 0 ? `<span class="agentation-badge-count">${count}</span>` : ''}
        </div>
      ` : `
        <button class="agentation-btn" data-action="toggle" title="Toggle annotation mode">
          ${icons.logo}
        </button>
        <div class="agentation-divider"></div>
        <div class="agentation-controls">
          <button class="agentation-btn ${settings.markersVisible ? '' : 'active'}" data-action="visibility" title="Toggle markers">
            ${settings.markersVisible ? icons.eye : icons.eyeOff}
          </button>
          <button class="agentation-btn" data-action="copy" title="Copy to clipboard">
            ${icons.copy}
          </button>
          <button class="agentation-btn" data-action="clear" title="Clear annotations">
            ${icons.trash}
          </button>
          <span class="agentation-count">${count}</span>
          <div class="agentation-divider"></div>
          <button class="agentation-btn" data-action="close" title="Close">
            ${icons.close}
          </button>
        </div>
      `}
    </div>
  `;
}

/**
 * Create markers container.
 */
function createMarkersContainer() {
  // Fixed markers (for fixed/sticky elements)
  const fixedContainer = document.createElement('div');
  fixedContainer.className = 'agentation-markers-fixed';
  document.body.appendChild(fixedContainer);

  // Scrolling markers (for normal elements)
  const scrollContainer = document.createElement('div');
  scrollContainer.className = 'agentation-markers-scroll';
  document.body.appendChild(scrollContainer);

  markersContainer = { fixed: fixedContainer, scroll: scrollContainer };
}

/**
 * Render annotation markers.
 */
function renderMarkers() {
  if (!markersContainer) return;

  markersContainer.fixed.innerHTML = '';
  markersContainer.scroll.innerHTML = '';

  if (!settings.markersVisible) return;

  const annotations = getAnnotations();
  annotations.forEach((ann, i) => {
    const marker = document.createElement('div');
    marker.className = `agentation-marker ${ann.isMultiSelect ? 'multi-select' : ''}`;
    marker.style.setProperty('--agentation-accent', settings.accentColor);
    marker.textContent = i + 1;
    marker.dataset.id = ann.id;
    marker.title = ann.comment || ann.element;

    if (ann.isFixed) {
      marker.style.left = `${ann.x}%`;
      marker.style.top = `${ann.y}px`;
      markersContainer.fixed.appendChild(marker);
    } else {
      marker.style.left = `${ann.x}%`;
      marker.style.top = `${ann.y}px`;
      markersContainer.scroll.appendChild(marker);
    }
  });
}

/**
 * Set up event listeners.
 */
function setupEventListeners() {
  // Toolbar clicks
  toolbar.addEventListener('click', handleToolbarClick);

  // Document clicks (for annotation)
  document.addEventListener('click', handleDocumentClick, true);

  // Hover highlight
  document.addEventListener('mouseover', handleMouseOver);
  document.addEventListener('mouseout', handleMouseOut);
}

/**
 * Handle toolbar button clicks.
 */
function handleToolbarClick(e) {
  const btn = e.target.closest('[data-action]');

  if (isCollapsed) {
    // Clicking collapsed toolbar expands it
    isCollapsed = false;
    toolbar.classList.remove('collapsed');
    updateToolbarContent();
    return;
  }

  if (!btn) return;

  const action = btn.dataset.action;

  switch (action) {
    case 'toggle':
      toggleActive();
      break;
    case 'visibility':
      settings.markersVisible = !settings.markersVisible;
      saveSettings(settings);
      updateToolbarContent();
      renderMarkers();
      break;
    case 'copy':
      handleCopy(btn);
      break;
    case 'clear':
      clearAllAnnotations();
      updateToolbarContent();
      renderMarkers();
      break;
    case 'close':
      isCollapsed = true;
      toolbar.classList.add('collapsed');
      setActive(false);
      updateToolbarContent();
      break;
  }
}

/**
 * Handle copy to clipboard.
 */
async function handleCopy(btn) {
  const annotations = getAnnotations();
  if (annotations.length === 0) return;

  const output = formatOutput(annotations, {
    detail: settings.detail,
    format: settings.format,
    route: config.route,
  });

  const success = await copyToClipboard(output);

  if (success) {
    // Show success feedback
    btn.innerHTML = icons.check;
    btn.classList.add('active');
    setTimeout(() => {
      btn.innerHTML = icons.copy;
      btn.classList.remove('active');
    }, 1500);

    // Auto-clear if enabled
    if (settings.autoClearOnCopy) {
      clearAllAnnotations();
      updateToolbarContent();
      renderMarkers();
    }
  }
}

/**
 * Handle document clicks for annotation.
 */
function handleDocumentClick(e) {
  if (!isActive) return;

  // Ignore clicks on toolbar and popups
  if (toolbar.contains(e.target)) return;
  if (e.target.closest('.agentation-popup')) return;
  if (e.target.closest('.agentation-marker')) return;

  // Prevent default if blocking interactions
  if (settings.blockInteractions) {
    e.preventDefault();
    e.stopPropagation();
  }

  // Don't start new annotation if popup is visible
  if (isPopupVisible()) return;

  const element = e.target;
  const elementName = identifyElement(element);
  const selectedText = window.getSelection()?.toString()?.trim() || '';

  // Remove hover highlight
  if (hoveredElement) {
    hoveredElement.removeAttribute('data-agentation-highlight');
    hoveredElement = null;
  }

  // Show popup
  showPopup(
    element,
    elementName,
    (comment) => {
      createAnnotation(element, comment, selectedText);
      updateToolbarContent();
      renderMarkers();
    },
    () => {
      // Cancelled - do nothing
    },
    { theme: settings.theme, accentColor: settings.accentColor }
  );
}

/**
 * Handle mouse over for hover highlight.
 */
function handleMouseOver(e) {
  if (!isActive) return;
  if (toolbar.contains(e.target)) return;
  if (e.target.closest('.agentation-popup')) return;
  if (e.target.closest('.agentation-marker')) return;
  if (isPopupVisible()) return;

  if (hoveredElement) {
    hoveredElement.removeAttribute('data-agentation-highlight');
  }

  hoveredElement = e.target;
  hoveredElement.setAttribute('data-agentation-highlight', '');
}

/**
 * Handle mouse out for hover highlight.
 */
function handleMouseOut(e) {
  if (!isActive) return;

  if (hoveredElement && !hoveredElement.contains(e.relatedTarget)) {
    hoveredElement.removeAttribute('data-agentation-highlight');
    hoveredElement = null;
  }
}

/**
 * Toggle active annotation mode.
 */
function toggleActive() {
  setActive(!isActive);
}

/**
 * Set active annotation mode.
 */
function setActive(active) {
  isActive = active;

  if (active) {
    if (settings.blockInteractions) {
      document.body.classList.add('agentation-blocking');
    }
  } else {
    document.body.classList.remove('agentation-blocking');
    if (hoveredElement) {
      hoveredElement.removeAttribute('data-agentation-highlight');
      hoveredElement = null;
    }
    hidePopup();
  }

  // Update toggle button appearance
  const toggleBtn = toolbar.querySelector('[data-action="toggle"]');
  if (toggleBtn) {
    toggleBtn.classList.toggle('active', active);
  }
}
```

**Step 2: Update index.js**

```javascript
/**
 * Agentation - Visual feedback tool for AI coding agents
 * @version 0.1.0
 */

import { initToolbar } from './toolbar.js';

(function() {
  'use strict';

  // Get config injected by Python
  const config = window.__AGENTATION_CONFIG__ || {};

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initToolbar(config));
  } else {
    initToolbar(config);
  }

  // Mark as loaded
  window.__AGENTATION_LOADED__ = true;
})();
```

**Step 3: Build and test**

```bash
npm run build
```

**Step 4: Commit**

```bash
git add src/js/toolbar.js src/js/index.js
git commit -m "feat(js): implement main toolbar with annotation support"
```

---

## Phase 5: Integration Testing

### Task 5.1: Create Example Flask App

**Files:**
- Create: `examples/flask_app/app.py`
- Create: `examples/flask_app/templates/index.html`

**Step 1: Create app.py**

```python
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
```

**Step 2: Create templates/index.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Agentation Flask Example</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: system-ui, sans-serif; line-height: 1.6; padding: 2rem; max-width: 800px; margin: 0 auto; }
        h1 { margin-bottom: 1rem; color: #1f2937; }
        p { margin-bottom: 1rem; color: #4b5563; }
        .card { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem; }
        .btn { display: inline-block; padding: 0.5rem 1rem; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 1rem; }
        .btn:hover { background: #2563eb; }
        .btn-secondary { background: #6b7280; }
        .btn-secondary:hover { background: #4b5563; }
        nav { margin-bottom: 2rem; }
        nav a { color: #3b82f6; margin-right: 1rem; text-decoration: none; }
        nav a:hover { text-decoration: underline; }
        form { margin-top: 1rem; }
        label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
        input, textarea { width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 4px; margin-bottom: 1rem; }
    </style>
</head>
<body>
    <nav>
        <a href="/">Home</a>
        <a href="/about">About</a>
    </nav>

    <h1>Welcome to Agentation Demo</h1>

    <p>This is an example Flask application with Agentation enabled. Try clicking on elements to annotate them!</p>

    <div class="card">
        <h2>Sample Card</h2>
        <p>This is a sample card component. You can click on any element to create an annotation.</p>
        <button class="btn">Primary Button</button>
        <button class="btn btn-secondary">Secondary Button</button>
    </div>

    <div class="card">
        <h2>Contact Form</h2>
        <form>
            <label for="name">Name</label>
            <input type="text" id="name" name="name" placeholder="Enter your name">

            <label for="email">Email</label>
            <input type="email" id="email" name="email" placeholder="Enter your email">

            <label for="message">Message</label>
            <textarea id="message" name="message" rows="4" placeholder="Enter your message"></textarea>

            <button type="submit" class="btn">Submit</button>
        </form>
    </div>

    <p>Press <kbd>Ctrl+Shift+A</kbd> (or <kbd>Cmd+Shift+A</kbd> on Mac) to toggle annotation mode.</p>
</body>
</html>
```

**Step 3: Create templates/about.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>About - Agentation Flask Example</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: system-ui, sans-serif; line-height: 1.6; padding: 2rem; max-width: 800px; margin: 0 auto; }
        h1 { margin-bottom: 1rem; color: #1f2937; }
        p { margin-bottom: 1rem; color: #4b5563; }
        nav { margin-bottom: 2rem; }
        nav a { color: #3b82f6; margin-right: 1rem; text-decoration: none; }
    </style>
</head>
<body>
    <nav>
        <a href="/">Home</a>
        <a href="/about">About</a>
    </nav>

    <h1>About Agentation</h1>

    <p>Agentation is a visual feedback tool for AI coding agents. It allows you to click on UI elements and generate structured feedback that AI agents can use to make precise code changes.</p>

    <p>Features include:</p>
    <ul>
        <li>Click-to-annotate any element</li>
        <li>Text selection support</li>
        <li>Multiple output detail levels</li>
        <li>Keyboard shortcuts</li>
        <li>LocalStorage persistence</li>
    </ul>
</body>
</html>
```

**Step 4: Test the Flask app**

```bash
cd examples/flask_app
pip install flask
python app.py
```

Open http://localhost:5000 and verify:
- Toolbar appears in bottom-right
- Can click elements to annotate
- Copy produces Markdown output

**Step 5: Commit**

```bash
git add examples/flask_app/
git commit -m "docs: add Flask example application"
```

---

### Task 5.2: Create Example FastAPI App

**Files:**
- Create: `examples/fastapi_app/main.py`
- Create: `examples/fastapi_app/templates/index.html`

**Step 1: Create main.py**

```python
"""Example FastAPI application with Agentation."""

import os
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

from agentation import AgentationConfig, AgentationMiddleware

# Enable Agentation
os.environ["AGENTATION_ENABLED"] = "true"

app = FastAPI(title="Agentation FastAPI Example")

# Add Agentation middleware
app.add_middleware(AgentationMiddleware)

# Templates
templates = Jinja2Templates(directory=Path(__file__).parent / "templates")


@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.get("/api/status")
async def status():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
```

**Step 2: Create templates/index.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Agentation FastAPI Example</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: system-ui, sans-serif; line-height: 1.6; padding: 2rem; max-width: 800px; margin: 0 auto; background: #f9fafb; }
        h1 { margin-bottom: 1rem; color: #1f2937; }
        p { margin-bottom: 1rem; color: #4b5563; }
        .card { background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .btn { display: inline-block; padding: 0.5rem 1rem; background: #10b981; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 1rem; }
        .btn:hover { background: #059669; }
        .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1rem; }
        .stat { text-align: center; padding: 1rem; background: white; border-radius: 8px; border: 1px solid #e5e7eb; }
        .stat-value { font-size: 2rem; font-weight: bold; color: #1f2937; }
        .stat-label { font-size: 0.875rem; color: #6b7280; }
    </style>
</head>
<body>
    <h1>FastAPI + Agentation Demo</h1>

    <p>This example shows Agentation integrated with FastAPI. The toolbar should appear in the corner.</p>

    <div class="stats">
        <div class="stat">
            <div class="stat-value">42</div>
            <div class="stat-label">Users Online</div>
        </div>
        <div class="stat">
            <div class="stat-value">128</div>
            <div class="stat-label">Tasks Completed</div>
        </div>
        <div class="stat">
            <div class="stat-value">99%</div>
            <div class="stat-label">Uptime</div>
        </div>
    </div>

    <div class="card">
        <h2>Quick Actions</h2>
        <p>Try annotating these buttons to provide feedback on their design.</p>
        <button class="btn">Create New</button>
        <button class="btn" style="background: #3b82f6;">View Reports</button>
        <button class="btn" style="background: #6b7280;">Settings</button>
    </div>

    <div class="card">
        <h2>Recent Activity</h2>
        <ul>
            <li>User signed up - 2 minutes ago</li>
            <li>Task completed - 5 minutes ago</li>
            <li>Report generated - 10 minutes ago</li>
        </ul>
    </div>
</body>
</html>
```

**Step 3: Test the FastAPI app**

```bash
cd examples/fastapi_app
pip install fastapi uvicorn jinja2
python main.py
```

Open http://localhost:8000 and verify Agentation works.

**Step 4: Commit**

```bash
git add examples/fastapi_app/
git commit -m "docs: add FastAPI example application"
```

---

### Task 5.3: Run All Tests

**Step 1: Run full test suite**

```bash
pytest tests/ -v
```

Expected: All tests pass

**Step 2: Commit if any fixes needed**

```bash
git add -A
git commit -m "fix: resolve test failures"
```

---

## Phase 6: Documentation & Release

### Task 6.1: Write README

**Files:**
- Create: `README.md`

**Step 1: Write README.md**

```markdown
# Agentation-py

Visual feedback tool for AI coding agents. Click on UI elements, add annotations, and copy structured output for AI assistants.

A Python port of [Agentation](https://agentation.dev) by Benji Taylor.

## Installation

```bash
pip install agentation
```

## Quick Start

### Flask

```python
from flask import Flask
from agentation import AgentationFlask

app = Flask(__name__)
AgentationFlask(app)  # Auto-enabled in debug mode
```

### FastAPI

```python
import os
os.environ["AGENTATION_ENABLED"] = "true"

from fastapi import FastAPI
from agentation import AgentationMiddleware

app = FastAPI()
app.add_middleware(AgentationMiddleware)
```

## Usage

1. **Toggle annotation mode**: Press `Ctrl+Shift+A` (or `Cmd+Shift+A` on Mac)
2. **Click any element** to annotate it
3. **Enter feedback** in the popup
4. **Copy output** using the clipboard button

## Output Example

```markdown
## Page Feedback: /dashboard
**Viewport:** 1512x738

### 1. button "Save"
**Location:** `.form-actions > button.primary`
**Feedback:** Button text should say "Submit"
```

## Configuration

```python
from agentation import AgentationConfig, AgentationFlask

config = AgentationConfig(
    default_detail="detailed",    # compact, standard, detailed, forensic
    default_format="markdown",    # markdown, json
    position="bottom-right",      # bottom-right, bottom-left, top-right, top-left
    theme="auto",                 # auto, light, dark
    accent_color="#3b82f6",
    keyboard_shortcut="ctrl+shift+a",
)

AgentationFlask(app, config=config)
```

## Enabling/Disabling

Agentation is disabled by default in production. Enable it using:

1. **Flask debug mode** (automatic)
2. **Environment variable**: `AGENTATION_ENABLED=true`
3. **Explicit config**: `AgentationConfig(enabled=True)`

## License

MIT
```

**Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add README with quick start guide"
```

---

### Task 6.2: Set Up GitHub Actions CI

**Files:**
- Create: `.github/workflows/ci.yml`

**Step 1: Create ci.yml**

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: ["3.10", "3.11", "3.12"]

    steps:
      - uses: actions/checkout@v4

      - name: Set up Python ${{ matrix.python-version }}
        uses: actions/setup-python@v5
        with:
          python-version: ${{ matrix.python-version }}

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Install Node dependencies
        run: npm ci

      - name: Build JavaScript
        run: npm run build

      - name: Install Python dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -e ".[dev]"

      - name: Run linter
        run: ruff check src/

      - name: Run type checker
        run: pyright src/

      - name: Run tests
        run: pytest tests/ -v

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.12"

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Install dependencies
        run: |
          npm ci
          pip install build

      - name: Build JavaScript
        run: npm run build

      - name: Build package
        run: python -m build

      - name: Upload artifact
        uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/
```

**Step 2: Commit**

```bash
mkdir -p .github/workflows
git add .github/workflows/ci.yml
git commit -m "ci: add GitHub Actions workflow for testing and building"
```

---

### Task 6.3: Final Integration Test

**Step 1: Build everything fresh**

```bash
npm run build
pip install -e ".[dev]"
pytest tests/ -v
```

**Step 2: Run Flask example and verify**

```bash
cd examples/flask_app
python app.py
# Open http://localhost:5000, test annotation workflow
```

**Step 3: Run FastAPI example and verify**

```bash
cd examples/fastapi_app
python main.py
# Open http://localhost:8000, test annotation workflow
```

**Step 4: Final commit**

```bash
git add -A
git commit -m "chore: final cleanup and integration verification"
```

---

## Summary

This plan covers the complete implementation of agentation-py:

**Phase 1**: Project setup with pyproject.toml and esbuild configuration
**Phase 2**: Python core (config, assets, injector)
**Phase 3**: Framework adapters (Flask, FastAPI)
**Phase 4**: JavaScript implementation (selector engine, annotations, output, toolbar)
**Phase 5**: Integration testing with example apps
**Phase 6**: Documentation and CI/CD

Total tasks: ~25 discrete commits, each building on the previous.

---

**Plan complete and saved to `docs/plans/2026-01-22-agentation-py-implementation.md`.**

**Two execution options:**

1. **Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

2. **Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

Which approach?
