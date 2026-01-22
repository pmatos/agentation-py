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

        from flask import request

        route = request.endpoint or request.path
        html = response.get_data(as_text=True)
        html = inject_agentation(html, self.config, route=route)
        response.set_data(html)

        return response
