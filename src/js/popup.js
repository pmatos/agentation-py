/**
 * Annotation popup component.
 */

/**
 * Show annotation popup near element.
 * @param {Element} element - The annotated element
 * @param {string} elementName - Human-readable element name
 * @param {Function} onSubmit - Callback with (comment) when submitted
 * @param {Function} onCancel - Callback when cancelled
 * @param {Object} options - { theme, accentColor }
 */
export function showPopup(element, elementName, onSubmit, onCancel, options = {}) {
  const { theme = 'dark', accentColor = '#3b82f6' } = options;

  // Remove any existing popup
  hidePopup();

  const rect = element.getBoundingClientRect();

  // Create popup
  const popup = document.createElement('div');
  popup.className = `agentation-popup ${theme}`;
  popup.style.setProperty('--agentation-accent', accentColor);

  // Position popup below element, or above if near bottom
  let top = rect.bottom + 8;
  let left = rect.left;

  // Adjust if too close to bottom
  if (top + 150 > window.innerHeight) {
    top = rect.top - 150 - 8;
  }

  // Adjust if too close to right edge
  if (left + 324 > window.innerWidth) {
    left = window.innerWidth - 324 - 16;
  }

  // Adjust if too close to left edge
  if (left < 16) {
    left = 16;
  }

  popup.style.top = `${top}px`;
  popup.style.left = `${left}px`;

  popup.innerHTML = `
    <div class="agentation-popup-header">
      Annotating: ${escapeHtml(elementName)}
    </div>
    <textarea
      class="agentation-popup-input"
      placeholder="What's the issue with this element?"
      autofocus
    ></textarea>
    <div class="agentation-popup-hint">
      Enter to save · Shift+Enter for new line · Escape to cancel
    </div>
  `;

  document.body.appendChild(popup);

  const textarea = popup.querySelector('textarea');
  textarea.focus();

  // Handle keyboard
  const handleKeydown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const comment = textarea.value.trim();
      hidePopup();
      onSubmit(comment);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      hidePopup();
      onCancel();
    }
  };

  textarea.addEventListener('keydown', handleKeydown);

  // Handle click outside
  const handleClickOutside = (e) => {
    if (!popup.contains(e.target)) {
      // Shake if there's content
      if (textarea.value.trim()) {
        popup.classList.add('shake');
        setTimeout(() => popup.classList.remove('shake'), 300);
      } else {
        hidePopup();
        onCancel();
      }
    }
  };

  // Delay to avoid immediate trigger
  setTimeout(() => {
    document.addEventListener('mousedown', handleClickOutside);
  }, 100);

  // Store cleanup function
  popup._cleanup = () => {
    textarea.removeEventListener('keydown', handleKeydown);
    document.removeEventListener('mousedown', handleClickOutside);
  };
}

/**
 * Hide and cleanup popup.
 */
export function hidePopup() {
  const popup = document.querySelector('.agentation-popup');
  if (popup) {
    if (popup._cleanup) {
      popup._cleanup();
    }
    popup.remove();
  }
}

/**
 * Check if popup is currently visible.
 */
export function isPopupVisible() {
  return !!document.querySelector('.agentation-popup');
}

/**
 * Escape HTML special characters.
 */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
