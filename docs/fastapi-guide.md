# Using Agentation with FastAPI

Agentation provides Starlette middleware that works with FastAPI to inject the annotation toolbar into your HTML responses.

## Installation

```bash
pip install agentation[fastapi]
```

Or if you already have FastAPI/Starlette installed:

```bash
pip install agentation
```

## Quick Start

```python
from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from agentation import AgentationMiddleware, AgentationConfig

app = FastAPI()

# Enable Agentation
config = AgentationConfig(enabled=True)
app.add_middleware(AgentationMiddleware, config=config)

@app.get("/", response_class=HTMLResponse)
async def index():
    return """
    <html>
    <body>
        <h1>Hello World</h1>
    </body>
    </html>
    """
```

The Agentation toolbar will appear on all HTML pages.

## How It Works

The `AgentationMiddleware` intercepts responses and:

1. Checks if Agentation is enabled (based on config, env var, or debug mode)
2. Filters for HTML responses only (skips JSON, images, etc.)
3. Injects a `<script>` tag before `</body>` containing the toolbar code
4. Includes the current route path in the output for context

## Configuration

### Basic Configuration

```python
from agentation import AgentationMiddleware, AgentationConfig

config = AgentationConfig(
    enabled=True,              # Force enable
    default_detail="detailed", # Output detail level
    default_format="markdown", # Output format
    position="bottom-right",   # Toolbar position
)

app.add_middleware(AgentationMiddleware, config=config)
```

### Using with FastAPI Debug Mode

```python
from fastapi import FastAPI
from agentation import AgentationMiddleware

app = FastAPI(debug=True)  # Enable debug mode
app.add_middleware(AgentationMiddleware)  # Auto-enabled when debug=True
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | `bool \| None` | `None` | Force enable/disable. `None` uses auto-detection |
| `default_detail` | `str` | `"standard"` | Detail level: `compact`, `standard`, `detailed`, `forensic` |
| `default_format` | `str` | `"markdown"` | Output format: `markdown`, `json` |
| `position` | `str` | `"bottom-right"` | Toolbar position: `bottom-right`, `bottom-left`, `top-right`, `top-left` |
| `theme` | `str` | `"auto"` | Color theme: `auto`, `light`, `dark` |
| `accent_color` | `str` | `"#3b82f6"` | Accent color (hex) |
| `keyboard_shortcut` | `str` | `"ctrl+shift+a"` | Toggle shortcut |
| `block_interactions` | `bool` | `True` | Block page clicks when annotating |
| `auto_clear_on_copy` | `bool` | `False` | Clear annotations after copying |
| `include_route` | `bool` | `True` | Include route path in output |

## Enabling Agentation

Agentation uses this precedence to determine if it's enabled:

1. **Explicit config**: `AgentationConfig(enabled=True)` or `enabled=False`
2. **Environment variable**: `AGENTATION_ENABLED=true` or `false`
3. **FastAPI debug mode**: Enabled when `FastAPI(debug=True)`
4. **Default**: Disabled

### Examples

```python
# Always enabled
config = AgentationConfig(enabled=True)
app.add_middleware(AgentationMiddleware, config=config)

# Always disabled
config = AgentationConfig(enabled=False)
app.add_middleware(AgentationMiddleware, config=config)

# Use environment variable
# Set AGENTATION_ENABLED=true in your environment
app.add_middleware(AgentationMiddleware)

# Auto-detect from debug mode
app = FastAPI(debug=True)
app.add_middleware(AgentationMiddleware)  # Enabled because debug=True
```

## Using the Toolbar

Once enabled, press `Ctrl+Shift+A` (or your configured shortcut) to toggle annotation mode.

### Workflow

1. **Activate**: Press `Ctrl+Shift+A` or click the Agentation badge
2. **Annotate**: Click elements to add notes/feedback
3. **Review**: See numbered markers on annotated elements
4. **Copy**: Click the copy button to get formatted output
5. **Share**: Paste the output to share with AI agents or team members

### Output Example (JSON)

```json
{
  "route": "/dashboard",
  "viewport": { "width": 1920, "height": 1080 },
  "annotations": [
    {
      "element": "button \"Submit\"",
      "location": "form.contact-form > button.btn-primary",
      "feedback": "This button should be more prominent"
    },
    {
      "element": "input \"email\"",
      "location": "#email-input",
      "feedback": "Add validation for email format"
    }
  ]
}
```

## Complete Example

```python
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from agentation import AgentationMiddleware, AgentationConfig

app = FastAPI(debug=True)

# Configure with custom settings
config = AgentationConfig(
    default_detail="detailed",
    default_format="json",
    theme="dark",
    position="bottom-left",
)
app.add_middleware(AgentationMiddleware, config=config)

templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/inline", response_class=HTMLResponse)
async def inline():
    return """
    <!DOCTYPE html>
    <html>
    <head><title>My App</title></head>
    <body>
        <h1>Welcome</h1>
        <nav>
            <a href="/">Home</a>
            <a href="/about">About</a>
        </nav>
        <form>
            <input type="email" placeholder="Email">
            <button type="submit">Subscribe</button>
        </form>
    </body>
    </html>
    """

@app.get("/api/data")
async def api_data():
    # JSON responses are not modified
    return {"message": "This endpoint returns JSON, not HTML"}
```

## Using with Starlette Directly

Agentation works with plain Starlette apps too:

```python
from starlette.applications import Starlette
from starlette.responses import HTMLResponse
from starlette.routing import Route
from agentation import AgentationMiddleware, AgentationConfig

async def homepage(request):
    return HTMLResponse("<html><body><h1>Hello</h1></body></html>")

app = Starlette(
    debug=True,
    routes=[Route("/", homepage)],
)

config = AgentationConfig(enabled=True)
app.add_middleware(AgentationMiddleware, config=config)
```

## Middleware Order

When using multiple middleware, add Agentation last (it will execute first):

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from agentation import AgentationMiddleware, AgentationConfig

app = FastAPI()

# Add other middleware first
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
)

# Add Agentation last (executes first, after response is ready)
app.add_middleware(AgentationMiddleware, config=AgentationConfig(enabled=True))
```

## Troubleshooting

### Toolbar doesn't appear

1. Check that debug mode is enabled: `FastAPI(debug=True)`
2. Or set `enabled=True` in config
3. Or set `AGENTATION_ENABLED=true` environment variable
4. Verify the response is HTML (use `response_class=HTMLResponse`)
5. Check that the response has a `</body>` tag

### Toolbar appears but doesn't work

1. Check browser console for JavaScript errors
2. Ensure no Content Security Policy is blocking inline scripts
3. Verify the page structure is valid HTML

### JSON endpoints affected

Agentation only modifies responses with `Content-Type: text/html`. JSON endpoints are not affected. If you're seeing issues:

1. Ensure your JSON endpoints return proper JSON responses
2. Check that `response_class` is not set to `HTMLResponse` for API endpoints

### Annotations not persisting

Annotations are stored in localStorage per-page with 7-day retention. Check:
1. localStorage is available
2. You're on the same URL path
3. Not in private/incognito mode with storage restrictions
