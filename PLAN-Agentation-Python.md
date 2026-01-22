# Agentation for Python: Implementation Plan

> A visual feedback tool for AI coding agents, adapted for Python web frameworks (Flask, FastAPI, Django)

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Background & Motivation](#2-background--motivation)
3. [Architecture Overview](#3-architecture-overview)
4. [Core Features](#4-core-features)
5. [Technical Implementation](#5-technical-implementation)
6. [Integration Methods](#6-integration-methods)
7. [Output Format Specification](#7-output-format-specification)
8. [Project Structure](#8-project-structure)
9. [Development Phases](#9-development-phases)
10. [Testing Strategy](#10-testing-strategy)
11. [Distribution & Packaging](#11-distribution--packaging)
12. [Future Enhancements](#12-future-enhancements)

---

## 1. Executive Summary

**Goal**: Create `agentation-py`, a Python package that provides visual annotation capabilities for any Python web application, enabling developers to click on UI elements and generate structured feedback that AI coding agents can act upon.

**Key Differentiators from Original**:
- Framework-agnostic (Flask, FastAPI, Django, Starlette, etc.)
- No React dependency - pure JavaScript injection
- Optional template source mapping for Python templates (Jinja2, Mako, Django templates)
- Designed for server-rendered applications, not just SPAs
- Works with HTMX and other progressive enhancement libraries

**Target Users**:
- Developers using Claude Code, Cursor, Windsurf, or similar AI coding assistants
- Teams building Flask, FastAPI, or Django applications
- Anyone who finds it easier to click than describe UI issues

---

## 2. Background & Motivation

### 2.1 The Problem

When working with AI coding agents on frontend issues, developers typically:

1. **Describe elements verbally**: "The button in the header that says 'Login'" - ambiguous
2. **Take screenshots**: Helpful but don't map to code
3. **Copy HTML snippets**: Manual, error-prone, often includes irrelevant context
4. **Reference CSS classes**: Requires developer to inspect elements first

This friction slows down the iterative refinement process that makes AI coding effective.

### 2.2 The Agentation Solution

The original [Agentation](https://agentation.dev) by [Benji Taylor](https://benji.org/agentation) solves this by:
- Providing a floating toolbar overlay
- Allowing click-to-select element annotation
- Generating structured output with CSS selectors, positions, and context
- Enabling AI agents to grep for exact code locations

### 2.3 Why a Python Port?

The original Agentation is a React component, limiting its use to React applications. Python web applications using:
- Flask + Jinja2
- FastAPI + Jinja2
- Django + Django Templates
- HTMX for interactivity

...cannot easily integrate the React component. A Python-native solution that injects vanilla JavaScript provides universal compatibility.

### 2.4 Reference Projects

This plan uses two real-world Python projects as design references:

| Project | Framework | Templates | CSS | Interactivity |
|---------|-----------|-----------|-----|---------------|
| **Rightkey** | Flask | Jinja2 | Tailwind CSS | Vanilla JS |
| **Petovita** | FastAPI | Jinja2 | Custom CSS | HTMX |

Both projects would benefit from visual annotation tooling.

---

## 3. Architecture Overview

### 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Python Web Application                       │
│  (Flask / FastAPI / Django / Starlette)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐    ┌──────────────────┐                   │
│  │   Middleware     │    │  Debug Toolbar   │                   │
│  │  (Auto-inject)   │    │   Integration    │                   │
│  └────────┬─────────┘    └────────┬─────────┘                   │
│           │                       │                              │
│           └───────────┬───────────┘                              │
│                       ▼                                          │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │              Template Context Processor                      ││
│  │  (Adds debug_element() helper + injects JS)                 ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ HTML Response
┌─────────────────────────────────────────────────────────────────┐
│                        Browser                                   │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │              Agentation JavaScript Module                    ││
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           ││
│  │  │  Toolbar    │ │  Selector   │ │  Output     │           ││
│  │  │  Controller │ │  Engine     │ │  Generator  │           ││
│  │  └─────────────┘ └─────────────┘ └─────────────┘           ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │              Your Application Page                           ││
│  │  (with optional data-agentation-source attributes)          ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Component Responsibilities

| Component | Responsibility |
|-----------|----------------|
| **Middleware** | Intercepts HTML responses in debug mode, injects Agentation JS |
| **Template Context Processor** | Provides `debug_element()` helper for source mapping |
| **JavaScript Module** | All browser-side annotation logic (framework-agnostic) |
| **Toolbar Controller** | Manages UI state, keyboard shortcuts, mode switching |
| **Selector Engine** | Generates optimal CSS selectors for clicked elements |
| **Output Generator** | Formats annotations into structured markdown/YAML/JSON |

### 3.3 Design Principles

1. **Zero production overhead**: All code paths gated by debug/development checks
2. **Framework agnostic**: Core JS works with any HTML page
3. **Progressive enhancement**: Works without source mapping, better with it
4. **Minimal dependencies**: Pure JavaScript, no build step required for basic usage
5. **Copy-paste workflow**: Output designed for pasting into AI chat interfaces

---

## 4. Core Features

### 4.1 Feature Parity with Original Agentation

| Feature | Description | Priority |
|---------|-------------|----------|
| **Click annotation** | Click any element to annotate it | P0 |
| **Text selection** | Highlight text spans for annotation | P0 |
| **Multi-select** | Drag to select multiple elements | P1 |
| **Area selection** | Annotate arbitrary regions (even empty space) | P2 |
| **Animation pause** | Freeze CSS animations for annotation | P1 |
| **Structured output** | Markdown with selectors, positions, context | P0 |
| **Dark/light mode** | Match user's system preference | P2 |
| **Keyboard shortcuts** | Quick activation/deactivation | P1 |

### 4.2 Python-Specific Enhancements

| Feature | Description | Priority |
|---------|-------------|----------|
| **Template source mapping** | Map DOM elements to template file:line | P1 |
| **CSS variable extraction** | Extract computed CSS custom properties | P2 |
| **HTMX awareness** | Capture `hx-*` attributes in output | P1 |
| **Route context** | Include current Flask/FastAPI route in output | P1 |
| **Form state capture** | Include current form field values | P2 |
| **Debug toolbar integration** | Optional integration with Flask-DebugToolbar | P3 |

### 4.3 Output Modes

Following the original's philosophy of calibrated detail levels:

| Mode | Use Case | Information Included |
|------|----------|---------------------|
| **Compact** | Quick fixes, simple styling | Selector + note |
| **Standard** | Most adjustments | Selector + position + text + classes |
| **Detailed** | Layout issues | + bounding box + parent chain + computed styles subset |
| **Forensic** | Complex debugging | + all computed styles + event listeners + template source |

---

## 5. Technical Implementation

### 5.1 JavaScript Module

The core JavaScript module is framework-agnostic and handles all browser-side logic.

#### 5.1.1 Module Structure

```
agentation/
└── static/
    └── agentation.js          # Main module (ES6, no dependencies)
        ├── AgentationToolbar   # UI component
        ├── SelectorEngine      # CSS selector generation
        ├── AnnotationManager   # Tracks user annotations
        ├── OutputFormatter     # Generates markdown/YAML/JSON
        └── KeyboardManager     # Shortcut handling
```

#### 5.1.2 Selector Generation Algorithm

The selector engine prioritizes specificity and grepability:

```
Priority order:
1. ID (#unique-id)
2. data-testid attribute ([data-testid="login-button"])
3. Unique class combination (.btn.btn-primary in .header)
4. Text content selector (button:contains("Submit"))
5. Structural path (main > section:nth-child(2) > div.card)
```

#### 5.1.3 Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+A` / `Cmd+Shift+A` | Toggle annotation mode |
| `Escape` | Exit annotation mode / clear selection |
| `Ctrl+C` / `Cmd+C` (in annotation mode) | Copy output to clipboard |
| `Tab` | Cycle through output modes |
| `P` | Pause/resume CSS animations |

#### 5.1.4 CSS Injection

Styles are injected via a `<style>` tag with high-specificity selectors to avoid conflicts:

```css
[data-agentation-highlight] {
  outline: 2px solid #3b82f6 !important;
  outline-offset: 2px !important;
}

.agentation-toolbar {
  position: fixed !important;
  bottom: 16px !important;
  right: 16px !important;
  z-index: 2147483647 !important; /* Max z-index */
  /* ... */
}
```

### 5.2 Python Package

#### 5.2.1 Package Structure

```
agentation-py/
├── pyproject.toml
├── README.md
├── LICENSE
├── src/
│   └── agentation/
│       ├── __init__.py           # Main exports
│       ├── core.py               # Core functionality
│       ├── middleware/
│       │   ├── __init__.py
│       │   ├── base.py           # Abstract middleware base
│       │   ├── flask.py          # Flask middleware
│       │   ├── fastapi.py        # FastAPI/Starlette middleware
│       │   └── django.py         # Django middleware
│       ├── template_helpers/
│       │   ├── __init__.py
│       │   ├── jinja2.py         # Jinja2 extensions
│       │   └── django.py         # Django template tags
│       ├── static/
│       │   ├── agentation.js     # Main JavaScript module
│       │   └── agentation.css    # Toolbar styles
│       └── config.py             # Configuration dataclass
├── tests/
│   ├── conftest.py
│   ├── test_flask.py
│   ├── test_fastapi.py
│   ├── test_selectors.py
│   └── test_output.py
└── examples/
    ├── flask_example/
    ├── fastapi_example/
    └── django_example/
```

#### 5.2.2 Configuration

```python
from dataclasses import dataclass, field
from typing import Literal

@dataclass
class AgentationConfig:
    """Configuration for Agentation."""

    # Core settings
    enabled: bool = True  # Master switch (auto-disabled in production)

    # Output settings
    default_mode: Literal["compact", "standard", "detailed", "forensic"] = "standard"
    output_format: Literal["markdown", "yaml", "json"] = "markdown"

    # Feature toggles
    template_source_mapping: bool = True  # Include template file:line
    include_route_context: bool = True    # Include current route info
    include_htmx_attributes: bool = True  # Capture hx-* attributes

    # UI settings
    toolbar_position: Literal["bottom-right", "bottom-left", "top-right", "top-left"] = "bottom-right"
    keyboard_shortcut: str = "ctrl+shift+a"
    theme: Literal["auto", "light", "dark"] = "auto"

    # Security
    allowed_hosts: list[str] = field(default_factory=lambda: ["localhost", "127.0.0.1"])
```

#### 5.2.3 Flask Integration

```python
# agentation/middleware/flask.py

from flask import Flask, request, g
from markupsafe import Markup

class AgentationFlask:
    """Flask extension for Agentation."""

    def __init__(self, app: Flask | None = None, config: AgentationConfig | None = None):
        self.config = config or AgentationConfig()
        if app is not None:
            self.init_app(app)

    def init_app(self, app: Flask) -> None:
        """Initialize with Flask app."""
        # Only enable in debug mode
        if not app.debug:
            return

        # Register template context processor
        app.context_processor(self._template_context)

        # Register after_request handler to inject JS
        app.after_request(self._inject_agentation)

        # Store config on app
        app.extensions['agentation'] = self

    def _template_context(self) -> dict:
        """Add template helpers to context."""
        return {
            'agentation_source': self._source_marker,
            'agentation_scripts': self._render_scripts,
        }

    def _source_marker(self, template_name: str, line: int) -> Markup:
        """Generate data attribute for source mapping."""
        if self.config.template_source_mapping:
            return Markup(f'data-agentation-source="{template_name}:{line}"')
        return Markup('')

    def _inject_agentation(self, response):
        """Inject Agentation JS into HTML responses."""
        if response.content_type and 'text/html' in response.content_type:
            # Inject before </body>
            html = response.get_data(as_text=True)
            injection = self._render_injection()
            html = html.replace('</body>', f'{injection}</body>')
            response.set_data(html)
        return response

    def _render_injection(self) -> str:
        """Render the JS/CSS injection HTML."""
        # Returns <script> and <style> tags
        ...
```

**Usage in Flask app:**

```python
from flask import Flask
from agentation import AgentationFlask

app = Flask(__name__)
agentation = AgentationFlask(app)

# Or with factory pattern:
def create_app():
    app = Flask(__name__)
    agentation.init_app(app)
    return app
```

#### 5.2.4 FastAPI Integration

```python
# agentation/middleware/fastapi.py

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
from fastapi import FastAPI

class AgentationMiddleware(BaseHTTPMiddleware):
    """Starlette/FastAPI middleware for Agentation."""

    def __init__(self, app, config: AgentationConfig | None = None):
        super().__init__(app)
        self.config = config or AgentationConfig()

    async def dispatch(self, request: Request, call_next) -> Response:
        response = await call_next(request)

        # Only modify HTML responses
        if 'text/html' in response.headers.get('content-type', ''):
            body = b''
            async for chunk in response.body_iterator:
                body += chunk

            html = body.decode()
            injection = self._render_injection(request)
            html = html.replace('</body>', f'{injection}</body>')

            return Response(
                content=html,
                status_code=response.status_code,
                headers=dict(response.headers),
                media_type=response.media_type
            )

        return response


def setup_agentation(app: FastAPI, config: AgentationConfig | None = None):
    """Configure Agentation for FastAPI."""
    config = config or AgentationConfig()

    # Only in debug mode
    import os
    if os.getenv('DEBUG', 'false').lower() != 'true':
        return

    app.add_middleware(AgentationMiddleware, config=config)

    # Add static file route for agentation assets
    from starlette.staticfiles import StaticFiles
    import agentation
    static_path = Path(agentation.__file__).parent / 'static'
    app.mount('/_agentation', StaticFiles(directory=static_path), name='agentation_static')
```

**Usage in FastAPI app:**

```python
from fastapi import FastAPI
from agentation import setup_agentation

app = FastAPI()
setup_agentation(app)
```

#### 5.2.5 Template Source Mapping

For Jinja2 templates, provide a helper that can be used to mark elements:

```python
# agentation/template_helpers/jinja2.py

from jinja2 import Environment, pass_context
from markupsafe import Markup

@pass_context
def agentation_source(context, line: int | None = None) -> Markup:
    """
    Template helper to mark element source location.

    Usage in template:
        <div {{ agentation_source() }} class="card">

    Or with explicit line:
        <div {{ agentation_source(42) }} class="card">
    """
    template_name = context.name  # Current template name
    if line is None:
        # Try to get from context (set by custom loader)
        line = context.get('_agentation_line', 0)

    return Markup(f'data-agentation-source="{template_name}:{line}"')


def setup_jinja2(env: Environment) -> None:
    """Add Agentation helpers to Jinja2 environment."""
    env.globals['agentation_source'] = agentation_source
```

**Advanced: Automatic Source Mapping**

For automatic source mapping without manual template modifications, we can create a custom Jinja2 extension that wraps block elements:

```python
# agentation/template_helpers/jinja2_auto.py

from jinja2 import Extension
from jinja2.lexer import Token

class AgentationExtension(Extension):
    """
    Jinja2 extension that automatically adds source mapping attributes.

    This extension modifies the token stream to inject data-agentation-source
    attributes into HTML elements during template compilation.

    Note: This is an advanced feature and may have edge cases.
    Consider manual annotation for critical elements.
    """

    def filter_stream(self, stream):
        """Process token stream to inject source markers."""
        for token in stream:
            yield token

            # After opening tags, inject source attribute
            if token.test('data') and '<' in token.value:
                # Parse HTML tag and inject attribute
                # (Simplified - real implementation needs proper HTML parsing)
                ...
```

### 5.3 JavaScript Implementation Details

#### 5.3.1 Main Module

```javascript
// agentation/static/agentation.js

/**
 * Agentation - Visual feedback tool for AI coding agents
 *
 * A framework-agnostic tool for annotating web page elements
 * and generating structured feedback for AI agents.
 */

(function() {
  'use strict';

  // Configuration (injected by Python middleware)
  const CONFIG = window.__AGENTATION_CONFIG__ || {
    mode: 'standard',
    format: 'markdown',
    position: 'bottom-right',
    theme: 'auto',
    routeContext: null,
  };

  /**
   * Generate an optimal CSS selector for an element.
   * Prioritizes grepability over brevity.
   */
  class SelectorEngine {
    generate(element) {
      // 1. Try ID
      if (element.id) {
        return `#${CSS.escape(element.id)}`;
      }

      // 2. Try data-testid
      const testId = element.getAttribute('data-testid');
      if (testId) {
        return `[data-testid="${testId}"]`;
      }

      // 3. Try unique class combination
      const uniqueClasses = this.findUniqueClasses(element);
      if (uniqueClasses) {
        return uniqueClasses;
      }

      // 4. Build structural path
      return this.buildPath(element);
    }

    findUniqueClasses(element) {
      const classes = Array.from(element.classList);
      if (classes.length === 0) return null;

      // Try increasingly specific class combinations
      for (let i = 1; i <= classes.length; i++) {
        const combo = classes.slice(0, i).map(c => `.${CSS.escape(c)}`).join('');
        if (document.querySelectorAll(combo).length === 1) {
          return combo;
        }
      }

      // Try with parent context
      const parent = element.parentElement;
      if (parent) {
        const parentSelector = this.generate(parent);
        const childClasses = classes.slice(0, 2).map(c => `.${CSS.escape(c)}`).join('');
        const combined = `${parentSelector} > ${element.tagName.toLowerCase()}${childClasses}`;
        if (document.querySelectorAll(combined).length === 1) {
          return combined;
        }
      }

      return null;
    }

    buildPath(element, maxDepth = 5) {
      const parts = [];
      let current = element;
      let depth = 0;

      while (current && current !== document.body && depth < maxDepth) {
        let part = current.tagName.toLowerCase();

        if (current.classList.length > 0) {
          part += `.${CSS.escape(current.classList[0])}`;
        }

        // Add nth-child if needed for uniqueness
        const siblings = current.parentElement?.children;
        if (siblings && siblings.length > 1) {
          const index = Array.from(siblings).indexOf(current) + 1;
          part += `:nth-child(${index})`;
        }

        parts.unshift(part);
        current = current.parentElement;
        depth++;
      }

      return parts.join(' > ');
    }
  }

  /**
   * Manages the annotation collection.
   */
  class AnnotationManager {
    constructor() {
      this.annotations = [];
    }

    add(element, note = '') {
      const selector = new SelectorEngine().generate(element);
      const rect = element.getBoundingClientRect();

      this.annotations.push({
        selector,
        note,
        text: element.textContent?.trim().slice(0, 100),
        tagName: element.tagName.toLowerCase(),
        classes: Array.from(element.classList),
        position: {
          x: Math.round(rect.x),
          y: Math.round(rect.y),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        },
        source: element.getAttribute('data-agentation-source'),
        htmx: this.extractHtmxAttributes(element),
        computedStyles: this.extractKeyStyles(element),
        timestamp: Date.now(),
      });
    }

    extractHtmxAttributes(element) {
      const htmx = {};
      for (const attr of element.attributes) {
        if (attr.name.startsWith('hx-')) {
          htmx[attr.name] = attr.value;
        }
      }
      return Object.keys(htmx).length > 0 ? htmx : null;
    }

    extractKeyStyles(element) {
      const computed = window.getComputedStyle(element);
      return {
        display: computed.display,
        position: computed.position,
        color: computed.color,
        backgroundColor: computed.backgroundColor,
        fontSize: computed.fontSize,
        padding: computed.padding,
        margin: computed.margin,
      };
    }

    clear() {
      this.annotations = [];
    }

    getAnnotations() {
      return [...this.annotations];
    }
  }

  /**
   * Formats annotations for output.
   */
  class OutputFormatter {
    constructor(mode = 'standard', format = 'markdown') {
      this.mode = mode;
      this.format = format;
    }

    format(annotations, routeContext = null) {
      switch (this.format) {
        case 'yaml':
          return this.toYAML(annotations, routeContext);
        case 'json':
          return this.toJSON(annotations, routeContext);
        default:
          return this.toMarkdown(annotations, routeContext);
      }
    }

    toMarkdown(annotations, routeContext) {
      let output = '## UI Feedback\n\n';

      if (routeContext) {
        output += `**Route**: \`${routeContext}\`\n\n`;
      }

      for (const ann of annotations) {
        output += `### ${ann.tagName}${ann.classes[0] ? '.' + ann.classes[0] : ''}\n\n`;
        output += `**Selector**: \`${ann.selector}\`\n`;

        if (ann.source && this.mode !== 'compact') {
          output += `**Source**: \`${ann.source}\`\n`;
        }

        if (ann.text && this.mode !== 'compact') {
          output += `**Text**: "${ann.text.slice(0, 50)}${ann.text.length > 50 ? '...' : ''}"\n`;
        }

        if (ann.note) {
          output += `**Issue**: ${ann.note}\n`;
        }

        if (this.mode === 'detailed' || this.mode === 'forensic') {
          output += `**Position**: x=${ann.position.x}, y=${ann.position.y}, ${ann.position.width}x${ann.position.height}\n`;
          output += `**Classes**: ${ann.classes.join(', ') || 'none'}\n`;
        }

        if (this.mode === 'forensic') {
          output += `**Computed Styles**:\n`;
          for (const [key, value] of Object.entries(ann.computedStyles)) {
            output += `  - ${key}: ${value}\n`;
          }
        }

        if (ann.htmx && (this.mode === 'detailed' || this.mode === 'forensic')) {
          output += `**HTMX Attributes**:\n`;
          for (const [key, value] of Object.entries(ann.htmx)) {
            output += `  - ${key}: ${value}\n`;
          }
        }

        output += '\n';
      }

      return output;
    }

    toYAML(annotations, routeContext) {
      // YAML output implementation
      let output = 'feedback:\n';
      if (routeContext) {
        output += `  route: "${routeContext}"\n`;
      }
      output += '  annotations:\n';

      for (const ann of annotations) {
        output += `    - selector: "${ann.selector}"\n`;
        if (ann.source) output += `      source: "${ann.source}"\n`;
        if (ann.note) output += `      issue: "${ann.note}"\n`;
        if (ann.text) output += `      text: "${ann.text.slice(0, 50)}"\n`;
        output += `      classes: [${ann.classes.map(c => `"${c}"`).join(', ')}]\n`;
      }

      return output;
    }

    toJSON(annotations, routeContext) {
      return JSON.stringify({
        route: routeContext,
        annotations: annotations.map(ann => ({
          selector: ann.selector,
          source: ann.source,
          issue: ann.note,
          text: ann.text,
          classes: ann.classes,
          position: this.mode !== 'compact' ? ann.position : undefined,
          computedStyles: this.mode === 'forensic' ? ann.computedStyles : undefined,
          htmx: ann.htmx,
        }))
      }, null, 2);
    }
  }

  /**
   * Main toolbar UI component.
   */
  class AgentationToolbar {
    constructor() {
      this.isActive = false;
      this.manager = new AnnotationManager();
      this.mode = CONFIG.mode;
      this.format = CONFIG.format;
      this.hoveredElement = null;

      this.createToolbar();
      this.attachEventListeners();
    }

    createToolbar() {
      // Create toolbar container
      this.toolbar = document.createElement('div');
      this.toolbar.className = 'agentation-toolbar';
      this.toolbar.innerHTML = `
        <div class="agentation-toolbar-inner">
          <button class="agentation-btn agentation-toggle" title="Toggle annotation mode (Ctrl+Shift+A)">
            <svg><!-- Annotation icon --></svg>
          </button>
          <div class="agentation-controls" style="display: none;">
            <select class="agentation-mode">
              <option value="compact">Compact</option>
              <option value="standard" selected>Standard</option>
              <option value="detailed">Detailed</option>
              <option value="forensic">Forensic</option>
            </select>
            <button class="agentation-btn agentation-copy" title="Copy to clipboard">
              <svg><!-- Copy icon --></svg>
            </button>
            <button class="agentation-btn agentation-clear" title="Clear annotations">
              <svg><!-- Clear icon --></svg>
            </button>
            <span class="agentation-count">0</span>
          </div>
        </div>
      `;

      document.body.appendChild(this.toolbar);
      this.injectStyles();
    }

    injectStyles() {
      const style = document.createElement('style');
      style.textContent = `
        .agentation-toolbar {
          position: fixed;
          ${CONFIG.position.includes('bottom') ? 'bottom' : 'top'}: 16px;
          ${CONFIG.position.includes('right') ? 'right' : 'left'}: 16px;
          z-index: 2147483647;
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 14px;
        }

        .agentation-toolbar-inner {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: var(--agentation-bg, #1f2937);
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .agentation-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          padding: 0;
          border: none;
          border-radius: 6px;
          background: transparent;
          color: var(--agentation-text, #f3f4f6);
          cursor: pointer;
          transition: background 0.15s;
        }

        .agentation-btn:hover {
          background: var(--agentation-hover, #374151);
        }

        .agentation-toggle.active {
          background: var(--agentation-accent, #3b82f6);
        }

        .agentation-controls {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .agentation-mode {
          padding: 4px 8px;
          border: 1px solid var(--agentation-border, #4b5563);
          border-radius: 4px;
          background: transparent;
          color: var(--agentation-text, #f3f4f6);
          font-size: 12px;
        }

        .agentation-count {
          min-width: 24px;
          padding: 2px 8px;
          background: var(--agentation-accent, #3b82f6);
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          text-align: center;
          color: white;
        }

        /* Highlight styles */
        [data-agentation-highlight] {
          outline: 2px solid #3b82f6 !important;
          outline-offset: 2px !important;
        }

        [data-agentation-selected] {
          outline: 2px solid #10b981 !important;
          outline-offset: 2px !important;
        }

        /* Note input popup */
        .agentation-note-popup {
          position: fixed;
          z-index: 2147483647;
          padding: 12px;
          background: var(--agentation-bg, #1f2937);
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .agentation-note-input {
          width: 300px;
          padding: 8px;
          border: 1px solid var(--agentation-border, #4b5563);
          border-radius: 4px;
          background: transparent;
          color: var(--agentation-text, #f3f4f6);
          font-size: 14px;
        }

        /* Theme support */
        @media (prefers-color-scheme: light) {
          .agentation-toolbar-inner {
            --agentation-bg: #ffffff;
            --agentation-text: #1f2937;
            --agentation-hover: #f3f4f6;
            --agentation-border: #d1d5db;
          }
        }
      `;
      document.head.appendChild(style);
    }

    attachEventListeners() {
      // Toggle button
      this.toolbar.querySelector('.agentation-toggle').addEventListener('click', () => {
        this.toggle();
      });

      // Mode selector
      this.toolbar.querySelector('.agentation-mode').addEventListener('change', (e) => {
        this.mode = e.target.value;
      });

      // Copy button
      this.toolbar.querySelector('.agentation-copy').addEventListener('click', () => {
        this.copyToClipboard();
      });

      // Clear button
      this.toolbar.querySelector('.agentation-clear').addEventListener('click', () => {
        this.clear();
      });

      // Keyboard shortcuts
      document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
          e.preventDefault();
          this.toggle();
        }
        if (this.isActive && e.key === 'Escape') {
          this.toggle();
        }
      });

      // Document click handler (when active)
      document.addEventListener('click', (e) => {
        if (!this.isActive) return;
        if (this.toolbar.contains(e.target)) return;

        e.preventDefault();
        e.stopPropagation();
        this.annotateElement(e.target);
      }, true);

      // Hover highlight
      document.addEventListener('mouseover', (e) => {
        if (!this.isActive) return;
        if (this.toolbar.contains(e.target)) return;

        if (this.hoveredElement) {
          this.hoveredElement.removeAttribute('data-agentation-highlight');
        }
        this.hoveredElement = e.target;
        this.hoveredElement.setAttribute('data-agentation-highlight', '');
      });
    }

    toggle() {
      this.isActive = !this.isActive;
      this.toolbar.querySelector('.agentation-toggle').classList.toggle('active', this.isActive);
      this.toolbar.querySelector('.agentation-controls').style.display = this.isActive ? 'flex' : 'none';

      if (!this.isActive && this.hoveredElement) {
        this.hoveredElement.removeAttribute('data-agentation-highlight');
        this.hoveredElement = null;
      }

      document.body.style.cursor = this.isActive ? 'crosshair' : '';
    }

    annotateElement(element) {
      // Remove highlight, add selected marker
      element.removeAttribute('data-agentation-highlight');
      element.setAttribute('data-agentation-selected', '');

      // Show note input popup
      this.showNotePopup(element);
    }

    showNotePopup(element) {
      const rect = element.getBoundingClientRect();

      const popup = document.createElement('div');
      popup.className = 'agentation-note-popup';
      popup.style.left = `${rect.left}px`;
      popup.style.top = `${rect.bottom + 8}px`;
      popup.innerHTML = `
        <input type="text" class="agentation-note-input" placeholder="What's the issue? (Enter to save, Esc to cancel)">
      `;

      document.body.appendChild(popup);

      const input = popup.querySelector('input');
      input.focus();

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.manager.add(element, input.value);
          this.updateCount();
          popup.remove();
        } else if (e.key === 'Escape') {
          element.removeAttribute('data-agentation-selected');
          popup.remove();
        }
      });

      input.addEventListener('blur', () => {
        if (input.value) {
          this.manager.add(element, input.value);
          this.updateCount();
        } else {
          element.removeAttribute('data-agentation-selected');
        }
        popup.remove();
      });
    }

    updateCount() {
      this.toolbar.querySelector('.agentation-count').textContent =
        this.manager.getAnnotations().length;
    }

    clear() {
      // Remove selected markers
      document.querySelectorAll('[data-agentation-selected]').forEach(el => {
        el.removeAttribute('data-agentation-selected');
      });

      this.manager.clear();
      this.updateCount();
    }

    copyToClipboard() {
      const formatter = new OutputFormatter(this.mode, this.format);
      const output = formatter.format(
        this.manager.getAnnotations(),
        CONFIG.routeContext
      );

      navigator.clipboard.writeText(output).then(() => {
        // Visual feedback
        const copyBtn = this.toolbar.querySelector('.agentation-copy');
        copyBtn.classList.add('copied');
        setTimeout(() => copyBtn.classList.remove('copied'), 1000);
      });
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new AgentationToolbar());
  } else {
    new AgentationToolbar();
  }

})();
```

---

## 6. Integration Methods

### 6.1 Method 1: Middleware (Recommended)

Automatic injection via middleware - zero template changes required.

**Flask:**
```python
from flask import Flask
from agentation import AgentationFlask

app = Flask(__name__)
agentation = AgentationFlask(app)  # Auto-disabled in production
```

**FastAPI:**
```python
from fastapi import FastAPI
from agentation import setup_agentation

app = FastAPI()
setup_agentation(app)  # Auto-disabled when DEBUG != 'true'
```

**Django:**
```python
# settings.py
MIDDLEWARE = [
    # ... other middleware
    'agentation.middleware.django.AgentationMiddleware',
]

AGENTATION_CONFIG = {
    'enabled': DEBUG,
    'template_source_mapping': True,
}
```

### 6.2 Method 2: Template Tag (Optional Enhancement)

For template source mapping, add markers to templates:

**Jinja2:**
```html
<div {{ agentation_source() }} class="card">
  <!-- Content -->
</div>
```

**Django:**
```html
{% load agentation %}
<div {% agentation_source %} class="card">
  <!-- Content -->
</div>
```

### 6.3 Method 3: Bookmarklet (Framework-Agnostic)

For quick testing or apps you don't control:

```javascript
javascript:(function(){
  const s=document.createElement('script');
  s.src='https://unpkg.com/agentation-py/dist/agentation.min.js';
  document.body.appendChild(s);
})();
```

### 6.4 Method 4: Browser Extension (Future)

A browser extension that:
- Activates on any localhost page
- Detects Python framework signatures
- Injects Agentation automatically

---

## 7. Output Format Specification

### 7.1 Markdown Output (Default)

```markdown
## UI Feedback

**Route**: `/dashboard`

### button.btn-primary

**Selector**: `.actions-section > button.btn-primary`
**Source**: `templates/dashboard.html:45`
**Text**: "Start Practice"
**Issue**: Button too small on mobile, hard to tap

**Position**: x=240, y=180, 120x40
**Classes**: btn, btn-primary, px-4, py-2

### div.stats-card

**Selector**: `#total-time`
**Source**: `templates/dashboard.html:28`
**Text**: "Total: 12h 30m"
**Issue**: Font size inconsistent with other stats

**Position**: x=100, y=300, 200x80
**Classes**: stats-card, bg-white, rounded-lg
```

### 7.2 YAML Output

```yaml
feedback:
  route: "/dashboard"
  annotations:
    - selector: ".actions-section > button.btn-primary"
      source: "templates/dashboard.html:45"
      issue: "Button too small on mobile, hard to tap"
      text: "Start Practice"
      classes: ["btn", "btn-primary", "px-4", "py-2"]
      position:
        x: 240
        y: 180
        width: 120
        height: 40

    - selector: "#total-time"
      source: "templates/dashboard.html:28"
      issue: "Font size inconsistent with other stats"
      text: "Total: 12h 30m"
      classes: ["stats-card", "bg-white", "rounded-lg"]
```

### 7.3 JSON Output

```json
{
  "route": "/dashboard",
  "annotations": [
    {
      "selector": ".actions-section > button.btn-primary",
      "source": "templates/dashboard.html:45",
      "issue": "Button too small on mobile, hard to tap",
      "text": "Start Practice",
      "classes": ["btn", "btn-primary", "px-4", "py-2"],
      "position": { "x": 240, "y": 180, "width": 120, "height": 40 }
    }
  ]
}
```

---

## 8. Project Structure

```
agentation-py/
├── .github/
│   └── workflows/
│       ├── ci.yml                # Tests, linting, type checking
│       └── publish.yml           # PyPI publishing
├── pyproject.toml                # Project metadata, dependencies
├── README.md                     # Documentation
├── LICENSE                       # MIT or similar
├── CHANGELOG.md                  # Version history
├── CLAUDE.md                     # AI assistant guidance
│
├── src/
│   └── agentation/
│       ├── __init__.py           # Public API exports
│       ├── py.typed              # PEP 561 marker
│       ├── config.py             # AgentationConfig dataclass
│       ├── core.py               # Core utilities
│       │
│       ├── middleware/
│       │   ├── __init__.py       # Middleware exports
│       │   ├── base.py           # Abstract base middleware
│       │   ├── flask.py          # Flask extension
│       │   ├── fastapi.py        # FastAPI/Starlette middleware
│       │   └── django.py         # Django middleware
│       │
│       ├── template_helpers/
│       │   ├── __init__.py       # Template helper exports
│       │   ├── jinja2.py         # Jinja2 extensions
│       │   └── django.py         # Django template tags
│       │
│       └── static/
│           ├── agentation.js     # Main JavaScript module
│           ├── agentation.min.js # Minified version
│           └── agentation.css    # Styles (optional separate file)
│
├── tests/
│   ├── conftest.py               # Shared fixtures
│   ├── test_config.py            # Configuration tests
│   ├── test_flask.py             # Flask integration tests
│   ├── test_fastapi.py           # FastAPI integration tests
│   ├── test_django.py            # Django integration tests
│   ├── test_selectors.py         # Selector engine tests (via Playwright)
│   ├── test_output.py            # Output formatter tests
│   └── fixtures/
│       ├── flask_app/            # Test Flask app
│       ├── fastapi_app/          # Test FastAPI app
│       └── templates/            # Test templates
│
├── examples/
│   ├── flask_example/
│   │   ├── app.py
│   │   └── templates/
│   ├── fastapi_example/
│   │   ├── main.py
│   │   └── templates/
│   └── django_example/
│       ├── manage.py
│       ├── settings.py
│       └── templates/
│
└── docs/
    ├── index.md                  # Main documentation
    ├── quickstart.md             # Getting started
    ├── configuration.md          # Config reference
    ├── flask.md                  # Flask guide
    ├── fastapi.md                # FastAPI guide
    ├── django.md                 # Django guide
    └── output-formats.md         # Output format reference
```

---

## 9. Development Phases

### Phase 1: Core JavaScript Module (Week 1-2)

**Goal**: Standalone JavaScript that works via bookmarklet

**Deliverables**:
- [ ] `agentation.js` - Core annotation functionality
- [ ] Selector engine with priority-based generation
- [ ] Toolbar UI with basic controls
- [ ] Markdown output formatter
- [ ] Keyboard shortcut support
- [ ] Basic test page for manual testing

**Acceptance Criteria**:
- Bookmarklet works on any webpage
- Can annotate elements and copy markdown output
- Output is useful for AI agents (selectors are grepable)

### Phase 2: Flask Integration (Week 2-3)

**Goal**: First-class Flask extension

**Deliverables**:
- [ ] `AgentationFlask` extension class
- [ ] Automatic JS injection middleware
- [ ] Jinja2 template helpers
- [ ] Route context injection
- [ ] Debug-mode gating
- [ ] Flask example app

**Acceptance Criteria**:
- `pip install agentation` + one line enables it
- Works with Flask debug mode
- Template source mapping functional

### Phase 3: FastAPI Integration (Week 3-4)

**Goal**: FastAPI/Starlette support

**Deliverables**:
- [ ] Starlette middleware
- [ ] `setup_agentation()` helper
- [ ] Static file serving
- [ ] FastAPI example app
- [ ] HTMX attribute capture

**Acceptance Criteria**:
- Works with FastAPI apps (like Petovita)
- HTMX attributes captured in output

### Phase 4: Polish & Documentation (Week 4-5)

**Goal**: Production-ready release

**Deliverables**:
- [ ] YAML and JSON output formats
- [ ] Multi-select (drag) support
- [ ] Area selection
- [ ] Animation pause feature
- [ ] Dark/light theme support
- [ ] Comprehensive documentation
- [ ] PyPI package

**Acceptance Criteria**:
- Feature parity with original Agentation
- Published to PyPI
- Documentation site live

### Phase 5: Advanced Features (Future)

**Potential additions**:
- [ ] Django integration
- [ ] Browser extension
- [ ] VS Code extension integration
- [ ] Screenshot capture
- [ ] Video recording of annotation sessions
- [ ] Claude Code MCP server for direct integration

---

## 10. Testing Strategy

### 10.1 Unit Tests

```python
# tests/test_config.py
def test_config_defaults():
    config = AgentationConfig()
    assert config.default_mode == "standard"
    assert config.enabled == True

def test_config_disabled_in_production():
    # When DEBUG is not set, should auto-disable
    ...

# tests/test_output.py
def test_markdown_output_compact():
    formatter = OutputFormatter(mode="compact")
    annotations = [{"selector": ".btn", "note": "too small"}]
    output = formatter.to_markdown(annotations)
    assert "**Selector**: `.btn`" in output
    assert "Position" not in output  # Compact mode excludes position
```

### 10.2 Integration Tests

```python
# tests/test_flask.py
import pytest
from flask import Flask
from agentation import AgentationFlask

@pytest.fixture
def app():
    app = Flask(__name__)
    app.debug = True
    AgentationFlask(app)

    @app.route('/')
    def index():
        return '<html><body><button class="btn">Click</button></body></html>'

    return app

def test_js_injected(app):
    client = app.test_client()
    response = client.get('/')
    assert b'agentation' in response.data
    assert b'__AGENTATION_CONFIG__' in response.data

def test_not_injected_in_production():
    app = Flask(__name__)
    app.debug = False
    AgentationFlask(app)
    # ... verify no injection
```

### 10.3 Browser Tests (Playwright)

```python
# tests/test_selectors.py
import pytest
from playwright.sync_api import Page

def test_selector_generation(page: Page, flask_server):
    page.goto(flask_server.url)

    # Inject test script
    page.evaluate("""
        const engine = new SelectorEngine();
        window.testResult = engine.generate(document.querySelector('.btn-primary'));
    """)

    result = page.evaluate("window.testResult")
    assert ".btn-primary" in result or "#" in result

def test_annotation_workflow(page: Page, flask_server):
    page.goto(flask_server.url)

    # Activate toolbar
    page.keyboard.press("Control+Shift+A")

    # Click element
    page.click(".btn-primary")

    # Enter note
    page.fill(".agentation-note-input", "Button too small")
    page.keyboard.press("Enter")

    # Copy output
    page.click(".agentation-copy")

    # Verify clipboard content
    clipboard = page.evaluate("navigator.clipboard.readText()")
    assert "btn-primary" in clipboard
    assert "Button too small" in clipboard
```

---

## 11. Distribution & Packaging

### 11.1 PyPI Package

```toml
# pyproject.toml
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
    { name = "Your Name", email = "you@example.com" }
]
classifiers = [
    "Development Status :: 4 - Beta",
    "Framework :: Flask",
    "Framework :: FastAPI",
    "Framework :: Django",
    "Intended Audience :: Developers",
    "License :: OSI Approved :: MIT License",
    "Programming Language :: Python :: 3.10",
    "Programming Language :: Python :: 3.11",
    "Programming Language :: Python :: 3.12",
    "Programming Language :: Python :: 3.13",
    "Topic :: Software Development :: Debuggers",
]
keywords = ["ai", "coding", "agents", "debugging", "flask", "fastapi", "django"]

dependencies = []  # No runtime dependencies!

[project.optional-dependencies]
flask = ["flask>=2.0"]
fastapi = ["fastapi>=0.100", "starlette>=0.27"]
django = ["django>=4.0"]
dev = [
    "pytest>=7.0",
    "pytest-playwright>=0.4",
    "ruff>=0.1",
    "pyright>=1.1",
]

[project.urls]
Homepage = "https://github.com/yourusername/agentation-py"
Documentation = "https://agentation-py.readthedocs.io"
Repository = "https://github.com/yourusername/agentation-py"

[tool.hatch.build.targets.wheel]
packages = ["src/agentation"]

[tool.hatch.build.targets.wheel.shared-data]
"src/agentation/static" = "share/agentation/static"
```

### 11.2 NPM Package (Optional)

For the standalone JavaScript module:

```json
{
  "name": "agentation-py",
  "version": "0.1.0",
  "description": "Visual feedback tool for AI coding agents (Python edition)",
  "main": "dist/agentation.js",
  "module": "dist/agentation.esm.js",
  "files": ["dist/"],
  "scripts": {
    "build": "esbuild src/agentation.js --bundle --minify --outfile=dist/agentation.min.js"
  }
}
```

### 11.3 CDN Distribution

Host on unpkg/jsDelivr for bookmarklet use:

```
https://unpkg.com/agentation-py/dist/agentation.min.js
```

---

## 12. Future Enhancements

### 12.1 Claude Code MCP Integration

Create an MCP server that provides Agentation as a tool:

```python
# agentation_mcp/server.py
from mcp import Server

server = Server("agentation")

@server.tool("annotate_ui")
async def annotate_ui(url: str) -> str:
    """
    Open a browser, allow user to annotate elements,
    return structured feedback.
    """
    # Use Playwright to open page
    # Inject Agentation
    # Wait for user to complete annotation
    # Return output
```

### 12.2 VS Code Extension Integration

- Command palette: "Agentation: Open in Browser"
- Automatic source file navigation from annotations
- Inline display of annotation feedback

### 12.3 Screenshot/Recording

- Capture screenshot with annotations highlighted
- Record annotation session as video
- Export as GIF for issue reports

### 12.4 Collaboration Features

- Share annotation sessions via URL
- Real-time collaborative annotation
- Integration with issue trackers (GitHub, Linear, Jira)

### 12.5 AI-Powered Suggestions

- Suggest common fixes based on annotation patterns
- Auto-detect accessibility issues
- CSS improvement recommendations

---

## Appendix A: Original Agentation Reference

- **Website**: https://agentation.dev
- **GitHub**: https://github.com/benjitaylor/agentation
- **Blog Post**: https://benji.org/agentation
- **Author**: Benji Taylor

## Appendix B: Related Tools

- **Flask-DebugToolbar**: https://github.com/flask-debugtoolbar/flask-debugtoolbar
- **Django Debug Toolbar**: https://github.com/jazzband/django-debug-toolbar
- **Playwright**: https://playwright.dev (for testing)

## Appendix C: Glossary

| Term | Definition |
|------|------------|
| **Annotation** | A user-created marker on a UI element with associated feedback |
| **Selector** | CSS selector that uniquely identifies an element |
| **Source mapping** | Linking DOM elements to their template file and line number |
| **Grepable** | Output format that can be searched in source code via grep/search |
| **Progressive enhancement** | Adding features that improve experience without breaking core function |

---

*Plan created: 2026-01-22*
*Target completion: 5 weeks from start*
*Author: Claude Code (assisted by Paulo Matos)*
