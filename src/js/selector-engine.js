/**
 * CSS Selector generation engine.
 * Generates optimal, grep-friendly selectors for elements.
 */

export class SelectorEngine {
  /**
   * Generate an optimal CSS selector for an element.
   * @param {Element} element - The DOM element
   * @returns {string} CSS selector
   */
  generate(element) {
    // 1. Try data-testid or data-element
    const testId = element.getAttribute('data-testid') || element.getAttribute('data-element');
    if (testId) {
      return `[data-testid="${testId}"]`;
    }

    // 2. Try unique ID
    if (element.id && this.isUnique(`#${CSS.escape(element.id)}`)) {
      return `#${CSS.escape(element.id)}`;
    }

    // 3. Try ARIA label
    const ariaLabel = element.getAttribute('aria-label');
    if (ariaLabel && this.isUnique(`[aria-label="${ariaLabel}"]`)) {
      return `[aria-label="${CSS.escape(ariaLabel)}"]`;
    }

    // 4. Try unique class combination
    const classSelector = this.findUniqueClasses(element);
    if (classSelector) {
      return classSelector;
    }

    // 5. Build structural path
    return this.buildPath(element);
  }

  /**
   * Check if a selector matches exactly one element.
   */
  isUnique(selector) {
    try {
      return document.querySelectorAll(selector).length === 1;
    } catch {
      return false;
    }
  }

  /**
   * Find a unique class combination for the element.
   */
  findUniqueClasses(element) {
    const classes = this.getCleanClasses(element);
    if (classes.length === 0) return null;

    // Try single classes first
    for (const cls of classes) {
      const selector = `.${CSS.escape(cls)}`;
      if (this.isUnique(selector)) {
        return selector;
      }
    }

    // Try class combinations (up to 3)
    for (let i = 2; i <= Math.min(3, classes.length); i++) {
      const combo = classes.slice(0, i).map(c => `.${CSS.escape(c)}`).join('');
      if (this.isUnique(combo)) {
        return combo;
      }
    }

    // Try with tag name
    const tag = element.tagName.toLowerCase();
    for (const cls of classes.slice(0, 2)) {
      const selector = `${tag}.${CSS.escape(cls)}`;
      if (this.isUnique(selector)) {
        return selector;
      }
    }

    // Try with parent context
    const parent = element.parentElement;
    if (parent) {
      const parentSelector = this.getSimpleSelector(parent);
      if (parentSelector) {
        const childClasses = classes.slice(0, 2).map(c => `.${CSS.escape(c)}`).join('');
        const combined = `${parentSelector} > ${tag}${childClasses}`;
        if (this.isUnique(combined)) {
          return combined;
        }
      }
    }

    return null;
  }

  /**
   * Get cleaned class names (remove CSS module hashes, short names).
   */
  getCleanClasses(element) {
    return Array.from(element.classList)
      .filter(cls => {
        // Remove very short classes
        if (cls.length <= 2) return false;
        // Remove CSS module hashes (pattern: _abc123 or abc_123abc)
        if (/^_[a-z0-9]+$/i.test(cls)) return false;
        if (/_[a-f0-9]{5,}$/i.test(cls)) return false;
        return true;
      });
  }

  /**
   * Get a simple selector for an element (for parent context).
   */
  getSimpleSelector(element) {
    if (element.id) {
      return `#${CSS.escape(element.id)}`;
    }
    const classes = this.getCleanClasses(element);
    if (classes.length > 0) {
      const tag = element.tagName.toLowerCase();
      return `${tag}.${CSS.escape(classes[0])}`;
    }
    return null;
  }

  /**
   * Build a structural path selector.
   */
  buildPath(element, maxDepth = 4) {
    const parts = [];
    let current = element;
    let depth = 0;

    while (current && current !== document.body && depth < maxDepth) {
      let part = current.tagName.toLowerCase();

      // Add first clean class if available
      const classes = this.getCleanClasses(current);
      if (classes.length > 0) {
        part += `.${CSS.escape(classes[0])}`;
      }

      // Add nth-child if siblings exist
      const parent = current.parentElement;
      if (parent) {
        const siblings = Array.from(parent.children).filter(
          c => c.tagName === current.tagName
        );
        if (siblings.length > 1) {
          const index = siblings.indexOf(current) + 1;
          part += `:nth-of-type(${index})`;
        }
      }

      parts.unshift(part);
      current = current.parentElement;
      depth++;
    }

    return parts.join(' > ');
  }

  /**
   * Get full DOM path (for forensic mode).
   */
  getFullPath(element) {
    const parts = [];
    let current = element;

    while (current && current !== document.documentElement) {
      let part = current.tagName.toLowerCase();

      if (current.id) {
        part += `#${CSS.escape(current.id)}`;
      } else {
        const classes = this.getCleanClasses(current);
        if (classes.length > 0) {
          part += `.${CSS.escape(classes[0])}`;
        }
      }

      parts.unshift(part);
      current = current.parentElement;
    }

    parts.unshift('html');
    return parts.join(' > ');
  }
}
