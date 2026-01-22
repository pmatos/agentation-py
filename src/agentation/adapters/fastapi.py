"""FastAPI/Starlette middleware for Agentation."""

from __future__ import annotations

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

from agentation.config import AgentationConfig, is_enabled
from agentation.injector import inject_agentation


class AgentationMiddleware(BaseHTTPMiddleware):
    """Starlette/FastAPI middleware that injects Agentation into HTML responses."""

    def __init__(self, app, config: AgentationConfig | None = None) -> None:
        super().__init__(app)
        self.config = config or AgentationConfig()
        self._enabled: bool | None = None

    async def dispatch(self, request: Request, call_next) -> Response:
        # Lazy enable check (need app.debug which may not be set at init time)
        if self._enabled is None:
            debug = getattr(request.app, "debug", False)
            self._enabled = is_enabled(self.config, framework_debug=debug)

        if not self._enabled:
            return await call_next(request)

        response = await call_next(request)

        content_type = response.headers.get("content-type", "")
        if "text/html" not in content_type:
            return response

        # Read body
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
