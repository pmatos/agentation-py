"""Framework adapters for Agentation."""

__all__ = ["AgentationFlask", "AgentationMiddleware"]


def __getattr__(name: str):
    """Lazy import adapters to avoid requiring all optional dependencies."""
    if name == "AgentationFlask":
        from agentation.adapters.flask import AgentationFlask

        return AgentationFlask
    if name == "AgentationMiddleware":
        from agentation.adapters.fastapi import AgentationMiddleware

        return AgentationMiddleware
    raise AttributeError(f"module {__name__!r} has no attribute {name!r}")
