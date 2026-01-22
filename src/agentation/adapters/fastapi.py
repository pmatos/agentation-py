"""FastAPI/Starlette middleware for Agentation."""

from __future__ import annotations

from typing import Any

from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response
from starlette.types import ASGIApp

from agentation.config import AgentationConfig, is_enabled
from agentation.injector import inject_agentation


class AgentationMiddleware(BaseHTTPMiddleware):
    """Starlette/FastAPI middleware that injects Agentation into HTML responses."""

    def __init__(self, app: ASGIApp, config: AgentationConfig | None = None) -> None:
        super().__init__(app)
        self.config = config or AgentationConfig()
        self._enabled: bool | None = None

    async def dispatch(
        self, request: Request, call_next: RequestResponseEndpoint
    ) -> Response:
        # Lazy enable check (need app.debug which may not be set at init time)
        if self._enabled is None:
            debug: bool = getattr(request.app, "debug", False)
            self._enabled = is_enabled(self.config, framework_debug=debug)

        if not self._enabled:
            return await call_next(request)

        response = await call_next(request)

        content_type: str = response.headers.get("content-type", "")
        if "text/html" not in content_type:
            return response

        # Read body from streaming response (BaseHTTPMiddleware returns StreamingResponse)
        body_iterator: Any = getattr(response, "body_iterator", None)
        if body_iterator is None:
            return response

        body = b""
        async for chunk in body_iterator:
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
