/**
 * Main Agentation toolbar component.
 */

import { icons } from './icons.js';
import { injectStyles } from './styles.js';
import {
  initAnnotations,
  createAnnotation,
  getAnnotations,
  clearAllAnnotations,
  getAnnotationCount,
} from './annotations.js';
import { formatOutput, copyToClipboard } from './output-formatter.js';
import { showPopup, hidePopup, isPopupVisible } from './popup.js';
import { registerShortcut } from './keyboard.js';
import { identifyElement } from './element-identification.js';
import { loadSettings, saveSettings } from './storage.js';

let toolbar = null;
let markersContainer = null;
let isActive = false;
let isCollapsed = true;
let hoveredElement = null;
let settings = {};
let config = {};

/**
 * Initialize Agentation toolbar.
 * @param {Object} cfg - Configuration from Python
 */
export function initToolbar(cfg = {}) {
  config = cfg;

  // Load persisted settings
  settings = {
    detail: cfg.defaultDetail || 'standard',
    format: cfg.defaultFormat || 'markdown',
    theme: cfg.theme || 'auto',
    accentColor: cfg.accentColor || '#3b82f6',
    blockInteractions: cfg.blockInteractions !== false,
    autoClearOnCopy: cfg.autoClearOnCopy || false,
    markersVisible: true,
    ...loadSettings(),
  };

  injectStyles();
  initAnnotations();
  createToolbar();
  createMarkersContainer();
  setupEventListeners();
  renderMarkers();

  // Register keyboard shortcut
  const shortcut = cfg.keyboardShortcut || 'ctrl+shift+a';
  registerShortcut(shortcut, toggleActive);
}

/**
 * Create toolbar DOM element.
 */
function createToolbar() {
  toolbar = document.createElement('div');
  toolbar.className = `agentation-toolbar collapsed ${settings.theme}`;
  toolbar.style.setProperty('--agentation-accent', settings.accentColor);

  // Position
  const pos = config.position || 'bottom-right';
  const [vertical, horizontal] = pos.split('-');
  toolbar.style[vertical] = '16px';
  toolbar.style[horizontal] = '16px';

  updateToolbarContent();
  document.body.appendChild(toolbar);
}

/**
 * Update toolbar HTML content.
 */
function updateToolbarContent() {
  const count = getAnnotationCount();

  toolbar.innerHTML = `
    <div class="agentation-toolbar-inner">
      ${isCollapsed ? `
        <div class="agentation-badge">
          ${icons.logo}
          ${count > 0 ? `<span class="agentation-badge-count">${count}</span>` : ''}
        </div>
      ` : `
        <button class="agentation-btn" data-action="toggle" title="Toggle annotation mode">
          ${icons.logo}
        </button>
        <div class="agentation-divider"></div>
        <div class="agentation-controls">
          <button class="agentation-btn ${settings.markersVisible ? '' : 'active'}" data-action="visibility" title="Toggle markers">
            ${settings.markersVisible ? icons.eye : icons.eyeOff}
          </button>
          <button class="agentation-btn" data-action="copy" title="Copy to clipboard">
            ${icons.copy}
          </button>
          <button class="agentation-btn" data-action="clear" title="Clear annotations">
            ${icons.trash}
          </button>
          <span class="agentation-count">${count}</span>
          <div class="agentation-divider"></div>
          <button class="agentation-btn" data-action="close" title="Close">
            ${icons.close}
          </button>
        </div>
      `}
    </div>
  `;
}

/**
 * Create markers container.
 */
function createMarkersContainer() {
  // Fixed markers (for fixed/sticky elements)
  const fixedContainer = document.createElement('div');
  fixedContainer.className = 'agentation-markers-fixed';
  document.body.appendChild(fixedContainer);

  // Scrolling markers (for normal elements)
  const scrollContainer = document.createElement('div');
  scrollContainer.className = 'agentation-markers-scroll';
  document.body.appendChild(scrollContainer);

  markersContainer = { fixed: fixedContainer, scroll: scrollContainer };
}

/**
 * Render annotation markers.
 */
function renderMarkers() {
  if (!markersContainer) return;

  markersContainer.fixed.innerHTML = '';
  markersContainer.scroll.innerHTML = '';

  if (!settings.markersVisible) return;

  const annotations = getAnnotations();
  annotations.forEach((ann, i) => {
    const marker = document.createElement('div');
    marker.className = `agentation-marker ${ann.isMultiSelect ? 'multi-select' : ''}`;
    marker.style.setProperty('--agentation-accent', settings.accentColor);
    marker.textContent = i + 1;
    marker.dataset.id = ann.id;
    marker.title = ann.comment || ann.element;

    if (ann.isFixed) {
      marker.style.left = `${ann.x}%`;
      marker.style.top = `${ann.y}px`;
      markersContainer.fixed.appendChild(marker);
    } else {
      marker.style.left = `${ann.x}%`;
      marker.style.top = `${ann.y}px`;
      markersContainer.scroll.appendChild(marker);
    }
  });
}

/**
 * Set up event listeners.
 */
function setupEventListeners() {
  // Toolbar clicks
  toolbar.addEventListener('click', handleToolbarClick);

  // Document clicks (for annotation)
  document.addEventListener('click', handleDocumentClick, true);

  // Hover highlight
  document.addEventListener('mouseover', handleMouseOver);
  document.addEventListener('mouseout', handleMouseOut);
}

/**
 * Handle toolbar button clicks.
 */
function handleToolbarClick(e) {
  const btn = e.target.closest('[data-action]');

  if (isCollapsed) {
    // Clicking collapsed toolbar expands it
    isCollapsed = false;
    toolbar.classList.remove('collapsed');
    updateToolbarContent();
    return;
  }

  if (!btn) return;

  const action = btn.dataset.action;

  switch (action) {
    case 'toggle':
      toggleActive();
      break;
    case 'visibility':
      settings.markersVisible = !settings.markersVisible;
      saveSettings(settings);
      updateToolbarContent();
      renderMarkers();
      break;
    case 'copy':
      handleCopy(btn);
      break;
    case 'clear':
      clearAllAnnotations();
      updateToolbarContent();
      renderMarkers();
      break;
    case 'close':
      isCollapsed = true;
      toolbar.classList.add('collapsed');
      setActive(false);
      updateToolbarContent();
      break;
  }
}

/**
 * Handle copy to clipboard.
 */
async function handleCopy(btn) {
  const annotations = getAnnotations();
  if (annotations.length === 0) return;

  const output = formatOutput(annotations, {
    detail: settings.detail,
    format: settings.format,
    route: config.route,
  });

  const success = await copyToClipboard(output);

  if (success) {
    // Show success feedback
    btn.innerHTML = icons.check;
    btn.classList.add('active');
    setTimeout(() => {
      btn.innerHTML = icons.copy;
      btn.classList.remove('active');
    }, 1500);

    // Auto-clear if enabled
    if (settings.autoClearOnCopy) {
      clearAllAnnotations();
      updateToolbarContent();
      renderMarkers();
    }
  }
}

/**
 * Handle document clicks for annotation.
 */
function handleDocumentClick(e) {
  if (!isActive) return;

  // Ignore clicks on toolbar and popups
  if (toolbar.contains(e.target)) return;
  if (e.target.closest('.agentation-popup')) return;
  if (e.target.closest('.agentation-marker')) return;

  // Prevent default if blocking interactions
  if (settings.blockInteractions) {
    e.preventDefault();
    e.stopPropagation();
  }

  // Don't start new annotation if popup is visible
  if (isPopupVisible()) return;

  const element = e.target;
  const elementName = identifyElement(element);
  const selectedText = window.getSelection()?.toString()?.trim() || '';

  // Remove hover highlight
  if (hoveredElement) {
    hoveredElement.removeAttribute('data-agentation-highlight');
    hoveredElement = null;
  }

  // Show popup
  showPopup(
    element,
    elementName,
    (comment) => {
      createAnnotation(element, comment, selectedText);
      updateToolbarContent();
      renderMarkers();
    },
    () => {
      // Cancelled - do nothing
    },
    { theme: settings.theme, accentColor: settings.accentColor }
  );
}

/**
 * Handle mouse over for hover highlight.
 */
function handleMouseOver(e) {
  if (!isActive) return;
  if (toolbar.contains(e.target)) return;
  if (e.target.closest('.agentation-popup')) return;
  if (e.target.closest('.agentation-marker')) return;
  if (isPopupVisible()) return;

  if (hoveredElement) {
    hoveredElement.removeAttribute('data-agentation-highlight');
  }

  hoveredElement = e.target;
  hoveredElement.setAttribute('data-agentation-highlight', '');
}

/**
 * Handle mouse out for hover highlight.
 */
function handleMouseOut(e) {
  if (!isActive) return;

  if (hoveredElement && !hoveredElement.contains(e.relatedTarget)) {
    hoveredElement.removeAttribute('data-agentation-highlight');
    hoveredElement = null;
  }
}

/**
 * Toggle active annotation mode.
 */
function toggleActive() {
  setActive(!isActive);
}

/**
 * Set active annotation mode.
 */
function setActive(active) {
  isActive = active;

  if (active) {
    if (settings.blockInteractions) {
      document.body.classList.add('agentation-blocking');
    }
  } else {
    document.body.classList.remove('agentation-blocking');
    if (hoveredElement) {
      hoveredElement.removeAttribute('data-agentation-highlight');
      hoveredElement = null;
    }
    hidePopup();
  }

  // Update toggle button appearance
  const toggleBtn = toolbar.querySelector('[data-action="toggle"]');
  if (toggleBtn) {
    toggleBtn.classList.toggle('active', active);
  }
}
