# Agentation

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)

Visual feedback tool for AI coding agents. Adds a floating toolbar to your web application that displays structured page information optimized for AI consumption.

## Installation

```bash
pip install agentation
```

With framework-specific extras:

```bash
pip install agentation[flask]
pip install agentation[fastapi]
```

## Quick Start

### Flask

```python
from flask import Flask
from agentation import AgentationFlask

app = Flask(__name__)
AgentationFlask(app)  # Auto-enabled when app.debug=True
```

See the [Flask Guide](docs/flask-guide.md) for complete documentation.

### FastAPI

```python
from fastapi import FastAPI
from agentation import AgentationMiddleware, AgentationConfig

app = FastAPI()
config = AgentationConfig(enabled=True)
app.add_middleware(AgentationMiddleware, config=config)
```

See the [FastAPI Guide](docs/fastapi-guide.md) for complete documentation.

## Configuration

All options can be passed to `AgentationConfig`:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | `bool \| None` | `None` | Enable toolbar. If `None`, uses env var or debug mode |
| `default_detail` | `str` | `"standard"` | Detail level: `compact`, `standard`, `detailed`, `forensic` |
| `default_format` | `str` | `"markdown"` | Output format: `markdown`, `json` |
| `position` | `str` | `"bottom-right"` | Toolbar position: `bottom-right`, `bottom-left`, `top-right`, `top-left` |
| `theme` | `str` | `"auto"` | Color theme: `auto`, `light`, `dark` |
| `accent_color` | `str` | `"#3b82f6"` | Accent color (hex) |
| `keyboard_shortcut` | `str` | `"ctrl+shift+a"` | Keyboard shortcut to toggle output |
| `block_interactions` | `bool` | `True` | Block page interactions while panel is open |
| `auto_clear_on_copy` | `bool` | `False` | Clear output after copying |
| `include_route` | `bool` | `True` | Include route info in output |

### Enabling

Agentation uses the following precedence to determine if it's enabled:

1. Explicit `enabled` config option
2. `AGENTATION_ENABLED` environment variable (`true`/`1`/`yes` or `false`/`0`/`no`)
3. Framework debug mode (e.g., `app.debug` in Flask)
4. Default: disabled

## Output Formats

### Markdown (default)

Structured text optimized for AI agents to understand page structure:

- **Compact**: Minimal output with key elements only
- **Standard**: Balanced detail with headings, forms, and main content
- **Detailed**: Full page structure including all interactive elements
- **Forensic**: Complete DOM analysis for debugging

### JSON

Machine-readable structured data with the same detail levels.

## Keyboard Shortcut

Press `Ctrl+Shift+A` (configurable) to toggle the output panel. This copies structured page information to your clipboard, ready for pasting into an AI coding assistant.

## Development

```bash
uv venv
uv pip install -e ".[dev]"
pytest
```

## Credits

Python port of [Agentation](https://github.com/BenjiTheC/agentation) by Benji Taylor.

## License

MIT
