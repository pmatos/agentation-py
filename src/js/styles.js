/**
 * Styles for Agentation toolbar and markers.
 */

export const STYLES = `
/* Agentation Toolbar */
.agentation-toolbar {
  position: fixed;
  z-index: 2147483647;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
  line-height: 1.4;
  box-sizing: border-box;
}

.agentation-toolbar *,
.agentation-toolbar *::before,
.agentation-toolbar *::after {
  box-sizing: border-box;
}

/* Toolbar inner container */
.agentation-toolbar-inner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--agentation-bg, #1f2937);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  transition: all 0.2s ease;
}

/* Collapsed state */
.agentation-toolbar.collapsed .agentation-toolbar-inner {
  padding: 0;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  justify-content: center;
  cursor: pointer;
}

.agentation-toolbar.collapsed .agentation-controls {
  display: none;
}

/* Buttons */
.agentation-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--agentation-text, #f3f4f6);
  cursor: pointer;
  transition: all 0.15s ease;
}

.agentation-btn:hover {
  background: var(--agentation-hover, #374151);
}

.agentation-btn.active {
  background: var(--agentation-accent, #3b82f6);
}

.agentation-btn svg {
  width: 18px;
  height: 18px;
}

/* Badge (collapsed state) */
.agentation-badge {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.agentation-badge-count {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  background: var(--agentation-accent, #3b82f6);
  border-radius: 9px;
  font-size: 11px;
  font-weight: 600;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Controls section */
.agentation-controls {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Annotation count */
.agentation-count {
  min-width: 28px;
  padding: 4px 8px;
  background: var(--agentation-accent, #3b82f6);
  border-radius: 14px;
  font-size: 12px;
  font-weight: 600;
  color: white;
  text-align: center;
}

/* Divider */
.agentation-divider {
  width: 1px;
  height: 20px;
  background: var(--agentation-border, #4b5563);
  margin: 0 4px;
}

/* Markers */
.agentation-marker {
  position: absolute;
  width: 24px;
  height: 24px;
  margin-left: -12px;
  margin-top: -12px;
  border-radius: 50%;
  background: var(--agentation-accent, #3b82f6);
  color: white;
  font-size: 12px;
  font-weight: 600;
  font-family: system-ui, -apple-system, sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2147483646;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.15s ease;
  pointer-events: auto;
}

.agentation-marker:hover {
  transform: scale(1.15);
}

.agentation-marker.multi-select {
  background: #10b981;
}

/* Fixed markers container */
.agentation-markers-fixed {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2147483645;
}

/* Scrolling markers container */
.agentation-markers-scroll {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  pointer-events: none;
  z-index: 2147483644;
}

/* Hover highlight */
[data-agentation-highlight] {
  outline: 2px solid var(--agentation-accent, #3b82f6) !important;
  outline-offset: 2px !important;
}

/* Popup */
.agentation-popup {
  position: fixed;
  z-index: 2147483647;
  padding: 12px;
  background: var(--agentation-bg, #1f2937);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  font-family: system-ui, -apple-system, sans-serif;
}

.agentation-popup-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  color: var(--agentation-text, #f3f4f6);
  font-size: 12px;
  opacity: 0.8;
}

.agentation-popup-input {
  width: 300px;
  min-height: 60px;
  padding: 10px;
  border: 1px solid var(--agentation-border, #4b5563);
  border-radius: 8px;
  background: transparent;
  color: var(--agentation-text, #f3f4f6);
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
}

.agentation-popup-input:focus {
  outline: none;
  border-color: var(--agentation-accent, #3b82f6);
}

.agentation-popup-hint {
  margin-top: 8px;
  font-size: 11px;
  color: var(--agentation-text, #f3f4f6);
  opacity: 0.6;
}

/* Drag selection box */
.agentation-drag-box {
  position: fixed;
  border: 2px dashed var(--agentation-accent, #3b82f6);
  background: rgba(59, 130, 246, 0.1);
  pointer-events: none;
  z-index: 2147483646;
}

/* Drag highlight */
.agentation-drag-highlight {
  position: absolute;
  background: rgba(59, 130, 246, 0.2);
  border: 2px solid var(--agentation-accent, #3b82f6);
  pointer-events: none;
  z-index: 2147483645;
}

/* Theme: Light mode */
.agentation-toolbar.light {
  --agentation-bg: #ffffff;
  --agentation-text: #1f2937;
  --agentation-hover: #f3f4f6;
  --agentation-border: #d1d5db;
}

.agentation-popup.light {
  --agentation-bg: #ffffff;
  --agentation-text: #1f2937;
  --agentation-border: #d1d5db;
}

/* Auto theme */
@media (prefers-color-scheme: light) {
  .agentation-toolbar.auto,
  .agentation-popup.auto {
    --agentation-bg: #ffffff;
    --agentation-text: #1f2937;
    --agentation-hover: #f3f4f6;
    --agentation-border: #d1d5db;
  }
}

/* Animation: Entrance */
@keyframes agentation-scale-in {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.agentation-toolbar {
  animation: agentation-scale-in 0.2s ease-out;
}

.agentation-marker {
  animation: agentation-scale-in 0.15s ease-out;
}

/* Animation: Popup shake */
@keyframes agentation-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}

.agentation-popup.shake {
  animation: agentation-shake 0.3s ease-in-out;
}

/* Block interactions mode */
body.agentation-blocking * {
  cursor: crosshair !important;
}

body.agentation-blocking .agentation-toolbar,
body.agentation-blocking .agentation-toolbar *,
body.agentation-blocking .agentation-popup,
body.agentation-blocking .agentation-popup *,
body.agentation-blocking .agentation-marker {
  cursor: default !important;
}
`;

/**
 * Inject styles into document.
 */
export function injectStyles() {
  if (document.getElementById('agentation-styles')) {
    return;
  }

  const style = document.createElement('style');
  style.id = 'agentation-styles';
  style.textContent = STYLES;
  document.head.appendChild(style);
}
