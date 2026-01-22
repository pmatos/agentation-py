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
