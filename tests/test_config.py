"""Tests for AgentationConfig."""

from agentation.config import AgentationConfig, is_enabled


def test_config_defaults():
    """Test default configuration values."""
    config = AgentationConfig()
    assert config.enabled is None
    assert config.default_detail == "standard"
    assert config.default_format == "markdown"
    assert config.position == "bottom-right"
    assert config.theme == "auto"
    assert config.accent_color == "#3b82f6"
    assert config.keyboard_shortcut == "ctrl+shift+a"
    assert config.block_interactions is True
    assert config.auto_clear_on_copy is False
    assert config.include_route is True


def test_config_custom_values():
    """Test configuration with custom values."""
    config = AgentationConfig(
        enabled=True,
        default_detail="forensic",
        default_format="json",
        position="top-left",
        theme="dark",
        accent_color="#ff0000",
    )
    assert config.enabled is True
    assert config.default_detail == "forensic"
    assert config.default_format == "json"
    assert config.position == "top-left"
    assert config.theme == "dark"
    assert config.accent_color == "#ff0000"


def test_config_to_dict():
    """Test configuration serialization to dict."""
    config = AgentationConfig(enabled=True, default_detail="compact")
    d = config.to_dict()
    assert d["enabled"] is True
    assert d["defaultDetail"] == "compact"
    assert d["position"] == "bottom-right"


def test_is_enabled_explicit_true():
    """Test is_enabled returns True when config.enabled is True."""
    config = AgentationConfig(enabled=True)
    assert is_enabled(config) is True


def test_is_enabled_explicit_false():
    """Test is_enabled returns False when config.enabled is False."""
    config = AgentationConfig(enabled=False)
    assert is_enabled(config) is False


def test_is_enabled_env_var_true(monkeypatch):
    """Test is_enabled respects AGENTATION_ENABLED=true."""
    monkeypatch.setenv("AGENTATION_ENABLED", "true")
    config = AgentationConfig()
    assert is_enabled(config) is True


def test_is_enabled_env_var_false(monkeypatch):
    """Test is_enabled respects AGENTATION_ENABLED=false."""
    monkeypatch.setenv("AGENTATION_ENABLED", "false")
    config = AgentationConfig()
    assert is_enabled(config) is False


def test_is_enabled_framework_debug():
    """Test is_enabled respects framework_debug when no explicit config or env."""
    config = AgentationConfig()
    assert is_enabled(config, framework_debug=True) is True
    assert is_enabled(config, framework_debug=False) is False


def test_is_enabled_default_false():
    """Test is_enabled defaults to False when nothing is set."""
    config = AgentationConfig()
    assert is_enabled(config) is False


def test_is_enabled_explicit_overrides_env(monkeypatch):
    """Test explicit config.enabled overrides environment variable."""
    monkeypatch.setenv("AGENTATION_ENABLED", "true")
    config = AgentationConfig(enabled=False)
    assert is_enabled(config) is False
