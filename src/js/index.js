/**
 * Agentation - Visual feedback tool for AI coding agents
 * @version 0.1.0
 */

import { initToolbar } from './toolbar.js';

(function() {
  'use strict';

  // Get config injected by Python
  const config = window.__AGENTATION_CONFIG__ || {};

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initToolbar(config));
  } else {
    initToolbar(config);
  }

  // Mark as loaded
  window.__AGENTATION_LOADED__ = true;
})();
