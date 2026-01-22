# Using Agentation with Flask

Agentation provides a Flask extension that automatically injects the annotation toolbar into your HTML responses.

## Installation

```bash
pip install agentation[flask]
```

Or if you already have Flask installed:

```bash
pip install agentation
```

## Quick Start

```python
from flask import Flask, render_template
from agentation import AgentationFlask

app = Flask(__name__)
AgentationFlask(app)

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)  # Agentation enabled automatically in debug mode
```

That's it! When running with `debug=True`, the Agentation toolbar will appear on all HTML pages.

## How It Works

The `AgentationFlask` extension registers an `after_request` hook that:

1. Checks if Agentation is enabled (based on config, env var, or debug mode)
2. Filters for HTML responses only (skips JSON, images, etc.)
3. Injects a `<script>` tag before `</body>` containing the toolbar code
4. Includes the current route name in the output for context

## Configuration

### Basic Configuration

```python
from agentation import AgentationFlask, AgentationConfig

config = AgentationConfig(
    enabled=True,              # Force enable (overrides debug mode)
    default_detail="detailed", # Output detail level
    default_format="markdown", # Output format
    position="bottom-right",   # Toolbar position
)

AgentationFlask(app, config=config)
```

### Using the Application Factory Pattern

```python
from flask import Flask
from agentation import AgentationFlask, AgentationConfig

agentation = AgentationFlask()

def create_app():
    app = Flask(__name__)

    config = AgentationConfig(default_detail="forensic")
    agentation.config = config
    agentation.init_app(app)

    return app
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
| `include_route` | `bool` | `True` | Include route name in output |

## Enabling Agentation

Agentation uses this precedence to determine if it's enabled:

1. **Explicit config**: `AgentationConfig(enabled=True)` or `enabled=False`
2. **Environment variable**: `AGENTATION_ENABLED=true` or `false`
3. **Flask debug mode**: Enabled when `app.debug=True`
4. **Default**: Disabled

### Examples

```python
# Always enabled (even in production - not recommended)
AgentationFlask(app, config=AgentationConfig(enabled=True))

# Always disabled
AgentationFlask(app, config=AgentationConfig(enabled=False))

# Use environment variable
# Set AGENTATION_ENABLED=true in your environment
AgentationFlask(app)

# Auto-detect from debug mode (default behavior)
AgentationFlask(app)
app.run(debug=True)  # Agentation enabled
```

## Using the Toolbar

Once enabled, press `Ctrl+Shift+A` (or your configured shortcut) to toggle annotation mode.

### Workflow

1. **Activate**: Press `Ctrl+Shift+A` or click the Agentation badge
2. **Annotate**: Click elements to add notes/feedback
3. **Review**: See numbered markers on annotated elements
4. **Copy**: Click the copy button to get formatted output
5. **Share**: Paste the output to share with AI agents or team members

### Output Example (Markdown)

```markdown
# Page Annotations
Route: /dashboard
Viewport: 1920x1080

## Annotations

1. **button "Submit"**
   - Location: `form.contact-form > button.btn-primary`
   - Feedback: This button should be more prominent

2. **input "email"**
   - Location: `#email-input`
   - Feedback: Add validation for email format
```

## Complete Example

```python
from flask import Flask, render_template_string
from agentation import AgentationFlask, AgentationConfig

app = Flask(__name__)

# Configure with custom settings
config = AgentationConfig(
    default_detail="detailed",
    theme="dark",
    position="bottom-left",
)
AgentationFlask(app, config=config)

@app.route('/')
def index():
    return render_template_string('''
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
    ''')

if __name__ == '__main__':
    app.run(debug=True)
```

## Troubleshooting

### Toolbar doesn't appear

1. Check that you're running in debug mode: `app.run(debug=True)`
2. Or set `enabled=True` in config
3. Or set `AGENTATION_ENABLED=true` environment variable
4. Verify the response is HTML (check Content-Type header)

### Toolbar appears but doesn't work

1. Check browser console for JavaScript errors
2. Ensure no Content Security Policy is blocking inline scripts
3. Verify the page has a `</body>` tag (required for injection)

### Annotations not persisting

Annotations are stored in localStorage per-page with 7-day retention. Check:
1. localStorage is available (not in private/incognito mode with restrictions)
2. You're on the same URL path
