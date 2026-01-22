# Agentation-py Design Document

> Visual feedback tool for AI coding agents, ported from React to Python web frameworks

**Date**: 2026-01-22
**Status**: Approved
**Original**: [Agentation](https://github.com/benjitaylor/agentation) by Benji Taylor

---

## Overview

Agentation-py is a Python package that injects a visual annotation toolbar into web pages during development. Users can click on UI elements, add feedback notes, and copy structured output (Markdown/JSON) that AI coding agents can act upon.

**Target frameworks**: Flask, FastAPI (Django planned for future)
**Test applications**: rightkey.app (Flask), petovita.com (FastAPI)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    agentation-py package                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Python Core                            │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │   │
│  │  │   config    │  │  injector   │  │   assets    │       │   │
│  │  │  dataclass  │  │  html→html  │  │   loader    │       │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘       │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Framework Adapters (thin wrappers)           │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐               │   │
│  │  │  Flask   │  │ FastAPI  │  │  Django  │               │   │
│  │  │Extension │  │Middleware│  │ (future) │               │   │
│  │  └──────────┘  └──────────┘  └──────────┘               │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              JavaScript Module (bundled)                  │   │
│  │  src/js/                      dist/                       │   │
│  │  ├── toolbar.js         →    agentation.min.js           │   │
│  │  ├── selector.js              (single IIFE bundle)       │   │
│  │  ├── annotations.js                                       │   │
│  │  ├── output.js                                            │   │
│  │  ├── storage.js                                           │   │
│  │  └── styles.css                                           │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

**Key principle**: The Python layer is minimal—it only handles configuration and injects the pre-built JavaScript before `</body>`. All annotation logic lives in JavaScript.

**Data flow**:
1. HTTP response passes through middleware
2. If HTML and enabled, inject `<script>` + config JSON before `</body>`
3. JavaScript initializes toolbar on DOMContentLoaded
4. User interacts entirely client-side
5. Copy button outputs Markdown/JSON to clipboard

---

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Scope** | Full feature parity | Match original Agentation capabilities |
| **JS Architecture** | Vanilla JS + esbuild | No runtime deps, modular development |
| **Python Core** | Framework-agnostic | `inject_agentation()` works anywhere |
| **Adapters** | Thin wrappers | Flask extension, FastAPI middleware |
| **Template Mapping** | Deferred | GitHub issue #1 for future |
| **Persistence** | localStorage | 7-day retention, per-page isolation |
| **Enabling** | Auto-detect + overrides | Debug mode → env var → explicit config |
| **Output Formats** | Markdown + JSON | Human-readable + machine-consumable |

---

## Package Structure

```
agentation-py/
├── pyproject.toml
├── README.md
├── LICENSE (MIT)
├── CLAUDE.md
│
├── src/agentation/
│   ├── __init__.py             # Public API
│   ├── py.typed                # PEP 561 marker
│   ├── config.py               # AgentationConfig dataclass
│   ├── injector.py             # inject_agentation(html, config) -> html
│   ├── assets.py               # Load bundled JS from package
│   │
│   ├── adapters/
│   │   ├── __init__.py
│   │   ├── flask.py            # AgentationFlask extension
│   │   └── fastapi.py          # AgentationMiddleware
│   │
│   └── static/
│       └── agentation.min.js   # Bundled JS (built from src/js/)
│
├── src/js/                     # JavaScript source (not distributed)
│   ├── index.js                # Entry point
│   ├── toolbar.js              # Main UI component
│   ├── selector-engine.js      # CSS selector generation
│   ├── annotations.js          # Annotation data management
│   ├── output-formatter.js     # Markdown + JSON generation
│   ├── storage.js              # localStorage persistence
│   ├── drag-handler.js         # Multi-select drag logic
│   ├── popup.js                # Annotation input popup
│   ├── settings.js             # Settings panel
│   ├── keyboard.js             # Shortcut handling
│   ├── animation-control.js    # Pause/resume animations
│   └── styles.css              # All styles
│
├── tests/
│   ├── conftest.py
│   ├── test_config.py
│   ├── test_injector.py
│   ├── test_flask.py
│   └── test_fastapi.py
│
└── examples/
    ├── flask_app/
    └── fastapi_app/
```

---

## Configuration

```python
from dataclasses import dataclass
from typing import Literal

@dataclass
class AgentationConfig:
    """Configuration for Agentation."""

    # Enabling (precedence: enabled > env var > debug detection)
    enabled: bool | None = None  # None = auto-detect

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
```

**Enabling logic**:
```python
def is_enabled(config: AgentationConfig, framework_debug: bool | None = None) -> bool:
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

---

## Framework Adapters

### Flask Extension

```python
from flask import Flask, request
from agentation import AgentationConfig, inject_agentation, is_enabled

class AgentationFlask:
    def __init__(self, app: Flask | None = None, config: AgentationConfig | None = None):
        self.config = config or AgentationConfig()
        if app:
            self.init_app(app)

    def init_app(self, app: Flask) -> None:
        if not is_enabled(self.config, framework_debug=app.debug):
            return
        app.after_request(self._inject)
        app.extensions["agentation"] = self

    def _inject(self, response):
        if "text/html" in (response.content_type or ""):
            route = request.endpoint or request.path
            html = response.get_data(as_text=True)
            html = inject_agentation(html, self.config, route=route)
            response.set_data(html)
        return response
```

**Usage**:
```python
from flask import Flask
from agentation import AgentationFlask

app = Flask(__name__)
AgentationFlask(app)  # Auto-disabled in production
```

### FastAPI Middleware

```python
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

class AgentationMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, config: AgentationConfig | None = None):
        super().__init__(app)
        self.config = config or AgentationConfig()

    async def dispatch(self, request: Request, call_next) -> Response:
        response = await call_next(request)
        if "text/html" in response.headers.get("content-type", ""):
            body = b"".join([chunk async for chunk in response.body_iterator])
            html = body.decode()
            route = request.url.path
            html = inject_agentation(html, self.config, route=route)
            return Response(content=html, status_code=response.status_code,
                          headers=dict(response.headers), media_type="text/html")
        return response
```

**Usage**:
```python
from fastapi import FastAPI
from agentation import AgentationMiddleware

app = FastAPI()
app.add_middleware(AgentationMiddleware)  # Check AGENTATION_ENABLED env var
```

---

## JavaScript Features

### Toolbar UI

**States**:
- **Collapsed**: Circular badge (44px) with icon + annotation count
- **Expanded**: Horizontal bar (260px) with controls
- **Draggable**: Repositionable anywhere on screen
- **Portal-based**: Rendered to `document.body`

**Controls** (when expanded):
1. **Pause/Play** - Freeze CSS animations and videos
2. **Eye toggle** - Show/hide annotation markers
3. **Copy** - Export to clipboard
4. **Trash** - Clear all annotations
5. **Settings gear** - Opens settings panel
6. **Close (X)** - Exit annotation mode

### Selection Modes

1. **Single click** - Click any element to annotate
2. **Text selection** - Select text first, then click
3. **Multi-select drag** - Click and drag to select multiple elements
   - 8px threshold before drag activates
   - Filters meaningful elements (buttons, links, headings, etc.)
   - Excludes tiny (<10×10px) and huge (>80% viewport) elements
   - Direct DOM updates for 60fps performance

### Selector Generation Priority

1. `data-testid` or `data-element` attributes
2. Unique ID (`#submit-btn`)
3. ARIA labels (`[aria-label="Close"]`)
4. Semantic element + text (`button "Save"`)
5. Unique class combination (`.btn.primary`)
6. Structural path (`form > .actions > button:nth-child(2)`)

### Settings Panel

- **Output Detail**: Compact / Standard / Detailed / Forensic
- **Output Format**: Markdown / JSON
- **Marker Color**: 7 preset colors
- **Theme**: Auto / Light / Dark
- **Auto-clear**: Clear annotations after copying
- **Block Interactions**: Prevent accidental clicks

---

## Output Formats

### Markdown (4 detail levels)

**Compact**:
```markdown
1. button "Save": Button text should say "Submit"
2. input "Email": Missing validation
```

**Standard** (default):
```markdown
## Page Feedback: /dashboard
**Viewport:** 1512x738

### 1. button "Save"
**Location:** `.form-actions > button.primary`
**Feedback:** Button text should say "Submit"
```

**Detailed**:
```markdown
### 1. button "Save"
**Location:** `.form-actions > button.primary`
**Classes:** btn, primary, large
**Position:** 450px, 320px (120×40px)
**Context:** "Cancel | Save | Reset"
**Feedback:** Button text should say "Submit"
```

**Forensic**:
```markdown
### 1. button "Save"
**Full DOM Path:** html > body > div.app > form > div.form-actions > button.primary
**Classes:** btn, primary, large
**Position:** x:450, y:320 (120×40px)
**Annotation at:** 45.0% from left, 320px from top
**Computed Styles:** color: #fff; background: #3b82f6; font-size: 16px; ...
**Accessibility:** role="button", tabindex="0"
**Nearby Elements:** button "Cancel", button "Reset"
**Feedback:** Button text should say "Submit"
```

### JSON

```json
{
  "route": "/dashboard",
  "viewport": { "width": 1512, "height": 738 },
  "annotations": [
    {
      "element": "button \"Save\"",
      "location": ".form-actions > button.primary",
      "feedback": "Button text should say \"Submit\"",
      "classes": ["btn", "primary", "large"],
      "position": { "x": 450, "y": 320, "width": 120, "height": 40 }
    }
  ]
}
```

---

## Development Phases

### Phase 1: JavaScript Core
- Toolbar UI (collapsed/expanded states)
- Single-click annotation
- Selector engine with priority-based generation
- Popup component
- Markdown output (all 4 detail levels)
- localStorage persistence
- Keyboard shortcuts
- Basic styles

### Phase 2: JavaScript Polish
- Multi-select drag with filtering
- Settings panel
- Animation pause/resume
- Draggable toolbar
- JSON output format
- Entrance/exit animations

### Phase 3: Python Package
- Config dataclass
- Core injector function
- Asset loading
- Flask adapter
- FastAPI adapter
- Package setup (pyproject.toml)

### Phase 4: Testing & Documentation
- Unit tests (config, injector)
- Integration tests (Flask, FastAPI)
- Browser tests (Playwright)
- README with quick start
- Example apps

### Phase 5: Release
- Build pipeline (esbuild)
- CI/CD (GitHub Actions)
- PyPI publishing

---

## Testing Strategy

### Python Unit Tests

```python
def test_config_defaults():
    config = AgentationConfig()
    assert config.default_detail == "standard"
    assert config.enabled is None

def test_is_enabled_explicit():
    config = AgentationConfig(enabled=True)
    assert is_enabled(config, framework_debug=False) == True

def test_injection_adds_script():
    html = "<html><body><h1>Hello</h1></body></html>"
    result = inject_agentation(html, AgentationConfig())
    assert "agentation" in result
    assert "__AGENTATION_CONFIG__" in result
```

### Integration Tests
- Verify JS injected in debug mode
- Verify no injection in production mode
- Verify config JSON is correct

### Browser Tests (Playwright)
- Toolbar appears and toggles
- Click annotation creates marker
- Copy outputs correct markdown
- Multi-select drag works
- Keyboard shortcuts function

---

## Future Enhancements

- **Template source mapping** (see GitHub issue #1)
- **Django adapter**
- **Browser extension** for non-Python apps
- **MCP server** for Claude Code integration
- **VS Code extension** with source navigation
- **Screenshot capture** with annotations

---

## References

- [Original Agentation](https://agentation.dev) by Benji Taylor
- [Agentation GitHub](https://github.com/benjitaylor/agentation)
- [Agentation blog post](https://benji.org/agentation)
