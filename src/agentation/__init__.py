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
