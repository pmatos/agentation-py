"""HTML injection for Agentation."""

from __future__ import annotations

import json
from typing import Any

from agentation.assets import get_js_content
from agentation.config import AgentationConfig


def inject_agentation(
    html: str,
    config: AgentationConfig,
    route: str | None = None,
) -> str:
    """
    Inject Agentation JavaScript into HTML response.

    Args:
        html: The HTML content to inject into
        config: Agentation configuration
        route: Optional route/path for context in output

    Returns:
        Modified HTML with Agentation injected before </body>
    """
    body_close_lower = html.lower().find("</body>")
    if body_close_lower == -1:
        return html

    js_config: dict[str, Any] = config.to_dict()
    if route and config.include_route:
        js_config["route"] = route

    js_content = get_js_content()
    config_json = json.dumps(js_config, separators=(",", ":"))
    config_json = config_json.replace("</", "<\\/")  # Escape closing tags

    injection = f"""<script>
window.__AGENTATION_CONFIG__ = {config_json};
{js_content}
</script>
"""

    body_close_pos = body_close_lower
    return html[:body_close_pos] + injection + html[body_close_pos:]
