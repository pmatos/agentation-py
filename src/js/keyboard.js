/**
 * Keyboard shortcut handling.
 */

const handlers = new Map();
let initialized = false;

/**
 * Parse shortcut string into key combo.
 * @param {string} shortcut - e.g., "ctrl+shift+a"
 * @returns {Object} { key, ctrl, shift, alt, meta }
 */
function parseShortcut(shortcut) {
  const parts = shortcut.toLowerCase().split('+');
  return {
    key: parts[parts.length - 1],
    ctrl: parts.includes('ctrl'),
    shift: parts.includes('shift'),
    alt: parts.includes('alt'),
    meta: parts.includes('meta') || parts.includes('cmd'),
  };
}

/**
 * Check if event matches shortcut.
 */
function matchesShortcut(event, shortcut) {
  const parsed = parseShortcut(shortcut);

  const keyMatches = event.key.toLowerCase() === parsed.key;
  const ctrlMatches = event.ctrlKey === parsed.ctrl;
  const shiftMatches = event.shiftKey === parsed.shift;
  const altMatches = event.altKey === parsed.alt;
  const metaMatches = event.metaKey === parsed.meta;

  return keyMatches && ctrlMatches && shiftMatches && altMatches && metaMatches;
}

/**
 * Global keydown handler.
 */
function handleKeydown(event) {
  for (const [shortcut, handler] of handlers) {
    if (matchesShortcut(event, shortcut)) {
      event.preventDefault();
      event.stopPropagation();
      handler();
      return;
    }
  }
}

/**
 * Initialize keyboard handler.
 */
function init() {
  if (initialized) return;
  document.addEventListener('keydown', handleKeydown, true);
  initialized = true;
}

/**
 * Register a keyboard shortcut.
 * @param {string} shortcut - e.g., "ctrl+shift+a"
 * @param {Function} handler
 */
export function registerShortcut(shortcut, handler) {
  init();
  handlers.set(shortcut.toLowerCase(), handler);
}

/**
 * Unregister a keyboard shortcut.
 * @param {string} shortcut
 */
export function unregisterShortcut(shortcut) {
  handlers.delete(shortcut.toLowerCase());
}

/**
 * Clear all shortcuts.
 */
export function clearShortcuts() {
  handlers.clear();
}
