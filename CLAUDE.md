# Agentation-py

Visual feedback tool for AI coding agents - Python port of the original Agentation by Benji Taylor.

**PyPI:** https://pypi.org/project/agentation/

## Installation

```bash
pip install agentation            # Core package
pip install agentation[flask]     # With Flask support
pip install agentation[fastapi]   # With FastAPI support
```

## Quick Reference

```bash
npm run build      # Bundle JavaScript
pytest tests/      # Run Python tests
```

## Architecture

```
src/
├── agentation/           # Python package
│   ├── config.py         # AgentationConfig dataclass, is_enabled()
│   ├── injector.py       # inject_agentation() - HTML injection
│   ├── assets.py         # get_js_content() - bundled JS loader
│   ├── adapters/
│   │   ├── flask.py      # AgentationFlask extension
│   │   └── fastapi.py    # AgentationMiddleware for Starlette
│   └── static/
│       └── agentation.min.js  # Built JS bundle (DO NOT EDIT)
└── js/                   # JavaScript source (edit these)
    ├── index.js          # Entry point
    ├── toolbar.js        # Main toolbar component
    ├── selector-engine.js
    ├── element-identification.js
    ├── annotations.js
    ├── output-formatter.js
    ├── storage.js
    ├── popup.js
    ├── keyboard.js
    ├── styles.js
    └── icons.js
```

## Development Guidelines

- **Python**: Use `uv` for environment management
- **JavaScript**: Edit files in `src/js/`, then run `npm run build`
- **Never edit** `agentation.min.js` directly - it's generated
- **Tests use** `conftest.py` to add `src/` to path (pyright warnings are false positives)

## Key Patterns

### Enable Logic (config.py)
Precedence: `enabled` config → `AGENTATION_ENABLED` env var → framework debug mode → disabled

### HTML Injection (injector.py)
- Injects `<script>` with config and bundled JS before `</body>`
- XSS protection: escapes `</` to `<\/` in JSON

### Framework Adapters
- **Flask**: `AgentationFlask(app)` - uses `after_request` hook
- **FastAPI**: `app.add_middleware(AgentationMiddleware)` - uses `BaseHTTPMiddleware`

## Testing

```bash
pytest tests/                    # All tests (32 total)
pytest tests/test_config.py      # Config tests
pytest tests/test_flask.py       # Flask adapter tests
pytest tests/test_fastapi.py     # FastAPI adapter tests
```

## Common Tasks

### Add a new config option
1. Add field to `AgentationConfig` in `config.py`
2. Add camelCase conversion in `to_dict()`
3. Add test in `test_config.py`
4. Use in JS via `window.__AGENTATION_CONFIG__`

### Modify toolbar UI
1. Edit relevant file in `src/js/`
2. Run `npm run build`
3. Test with example app: `python examples/flask_app/app.py`
