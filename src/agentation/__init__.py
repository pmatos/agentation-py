"""Agentation: Visual feedback tool for AI coding agents."""

__version__ = "0.1.0"

from agentation.config import AgentationConfig, is_enabled
from agentation.injector import inject_agentation

__all__ = [
    "AgentationConfig",
    "inject_agentation",
    "is_enabled",
    "__version__",
]


def __getattr__(name: str):
    if name == "AgentationFlask":
        from agentation.adapters.flask import AgentationFlask

        return AgentationFlask
    if name == "AgentationMiddleware":
        from agentation.adapters.fastapi import AgentationMiddleware

        return AgentationMiddleware
    raise AttributeError(f"module {__name__!r} has no attribute {name!r}")
