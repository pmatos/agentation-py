/**
 * LocalStorage persistence for annotations.
 * Per-page storage with 7-day retention.
 */

const STORAGE_PREFIX = 'agentation-annotations-';
const RETENTION_DAYS = 7;

/**
 * Get storage key for current page.
 */
function getStorageKey() {
  return STORAGE_PREFIX + window.location.pathname;
}

/**
 * Load annotations from localStorage.
 * Filters out annotations older than RETENTION_DAYS.
 * @returns {Array} Annotations array
 */
export function loadAnnotations() {
  try {
    const key = getStorageKey();
    const stored = localStorage.getItem(key);
    if (!stored) return [];

    const annotations = JSON.parse(stored);
    const now = Date.now();
    const maxAge = RETENTION_DAYS * 24 * 60 * 60 * 1000;

    // Filter out old annotations
    const valid = annotations.filter(a => {
      return a.timestamp && (now - a.timestamp) < maxAge;
    });

    // Save filtered list if any were removed
    if (valid.length !== annotations.length) {
      saveAnnotations(valid);
    }

    return valid;
  } catch (e) {
    console.warn('Agentation: Failed to load annotations', e);
    return [];
  }
}

/**
 * Save annotations to localStorage.
 * @param {Array} annotations
 */
export function saveAnnotations(annotations) {
  try {
    const key = getStorageKey();
    if (annotations.length === 0) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(annotations));
    }
  } catch (e) {
    console.warn('Agentation: Failed to save annotations', e);
  }
}

/**
 * Clear all annotations for current page.
 */
export function clearAnnotations() {
  try {
    const key = getStorageKey();
    localStorage.removeItem(key);
  } catch (e) {
    console.warn('Agentation: Failed to clear annotations', e);
  }
}

/**
 * Load settings from localStorage.
 * @returns {Object} Settings object
 */
export function loadSettings() {
  try {
    const stored = localStorage.getItem('agentation-settings');
    if (!stored) return {};
    return JSON.parse(stored);
  } catch {
    return {};
  }
}

/**
 * Save settings to localStorage.
 * @param {Object} settings
 */
export function saveSettings(settings) {
  try {
    localStorage.setItem('agentation-settings', JSON.stringify(settings));
  } catch (e) {
    console.warn('Agentation: Failed to save settings', e);
  }
}
