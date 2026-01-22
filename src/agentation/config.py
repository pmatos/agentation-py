"""Configuration for Agentation."""

from __future__ import annotations

import os
from dataclasses import dataclass
from typing import Any, Literal


@dataclass
class AgentationConfig:
    """Configuration for Agentation toolbar injection."""

    # Enabling (precedence: enabled > env var > debug detection)
    enabled: bool | None = None

    # Output settings
    default_detail: Literal["compact", "standard", "detailed", "forensic"] = "standard"
    default_format: Literal["markdown", "json"] = "markdown"

    # UI settings
    position: Literal["bottom-right", "bottom-left", "top-right", "top-left"] = "bottom-right"
    theme: Literal["auto", "light", "dark"] = "auto"
    accent_color: str = "#3b82f6"

    # Behavior
    keyboard_shortcut: str = "ctrl+shift+a"
    block_interactions: bool = True
    auto_clear_on_copy: bool = False
    include_route: bool = True

    def to_dict(self) -> dict[str, Any]:
        """Convert config to dict for JSON serialization (camelCase keys for JS)."""
        return {
            "enabled": self.enabled,
            "defaultDetail": self.default_detail,
            "defaultFormat": self.default_format,
            "position": self.position,
            "theme": self.theme,
            "accentColor": self.accent_color,
            "keyboardShortcut": self.keyboard_shortcut,
            "blockInteractions": self.block_interactions,
            "autoClearOnCopy": self.auto_clear_on_copy,
            "includeRoute": self.include_route,
        }


def is_enabled(config: AgentationConfig, framework_debug: bool | None = None) -> bool:
    """
    Determine if Agentation should be enabled.

    Precedence:
    1. Explicit config.enabled takes precedence
    2. AGENTATION_ENABLED environment variable
    3. Framework debug mode detection
    4. Default: False (safe)
    """
    # 1. Explicit config takes precedence
    if config.enabled is not None:
        return config.enabled

    # 2. Environment variable
    env = os.getenv("AGENTATION_ENABLED", "").lower()
    if env in ("true", "1", "yes"):
        return True
    if env in ("false", "0", "no"):
        return False

    # 3. Framework debug mode detection
    if framework_debug is not None:
        return framework_debug

    return False
