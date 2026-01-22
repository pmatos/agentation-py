/**
 * Element identification utilities.
 * Generates human-readable names and extracts metadata.
 */

import { SelectorEngine } from './selector-engine.js';

const selectorEngine = new SelectorEngine();

/**
 * Identify an element with a human-readable name.
 * @param {Element} element
 * @returns {string}
 */
export function identifyElement(element) {
  const tag = element.tagName.toLowerCase();

  // Check for explicit naming
  const dataElement = element.getAttribute('data-element');
  if (dataElement) {
    return dataElement;
  }

  // SVG elements
  if (element instanceof SVGElement || tag === 'svg') {
    const parent = element.closest('button, a, [role="button"]');
    if (parent) {
      return `icon in ${identifyElement(parent)}`;
    }
    return 'graphic';
  }

  // Get text content (cleaned)
  const text = getElementText(element);

  // Buttons
  if (tag === 'button' || element.getAttribute('role') === 'button') {
    return text ? `button "${truncate(text, 25)}"` : 'button';
  }

  // Links
  if (tag === 'a') {
    if (text) return `link "${truncate(text, 25)}"`;
    const href = element.getAttribute('href');
    if (href) return `link to "${truncate(href, 30)}"`;
    return 'link';
  }

  // Inputs
  if (tag === 'input') {
    const type = element.getAttribute('type') || 'text';
    const placeholder = element.getAttribute('placeholder');
    const name = element.getAttribute('name');
    const label = placeholder || name || type;
    return `input "${truncate(label, 20)}"`;
  }

  // Textareas
  if (tag === 'textarea') {
    const placeholder = element.getAttribute('placeholder');
    const name = element.getAttribute('name');
    return `textarea "${truncate(placeholder || name || '', 20)}"`;
  }

  // Selects
  if (tag === 'select') {
    const name = element.getAttribute('name');
    return name ? `select "${truncate(name, 20)}"` : 'select';
  }

  // Images
  if (tag === 'img') {
    const alt = element.getAttribute('alt');
    return alt ? `image "${truncate(alt, 25)}"` : 'image';
  }

  // Headings
  if (/^h[1-6]$/.test(tag)) {
    return text ? `${tag} "${truncate(text, 35)}"` : tag;
  }

  // Paragraphs
  if (tag === 'p') {
    return text ? `paragraph: "${truncate(text, 40)}..."` : 'paragraph';
  }

  // Labels
  if (tag === 'label') {
    return text ? `label "${truncate(text, 25)}"` : 'label';
  }

  // Semantic containers
  if (['section', 'article', 'nav', 'header', 'footer', 'main', 'aside'].includes(tag)) {
    const ariaLabel = element.getAttribute('aria-label');
    if (ariaLabel) return `${tag} "${truncate(ariaLabel, 25)}"`;
    return tag;
  }

  // Divs and spans - try to find meaningful identifier
  if (tag === 'div' || tag === 'span') {
    const classes = selectorEngine.getCleanClasses(element);
    if (classes.length > 0) {
      return `${tag}.${classes[0]}`;
    }
    return tag;
  }

  // Default: tag with optional class
  const classes = selectorEngine.getCleanClasses(element);
  if (classes.length > 0) {
    return `${tag}.${classes[0]}`;
  }

  return tag;
}

/**
 * Get clean text content from element.
 */
function getElementText(element) {
  // Get direct text, not from children
  let text = '';
  for (const node of element.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      text += node.textContent;
    }
  }
  text = text.trim();

  // Fallback to textContent for simple elements
  if (!text && element.childElementCount === 0) {
    text = element.textContent?.trim() || '';
  }

  return text;
}

/**
 * Truncate string with ellipsis.
 */
function truncate(str, maxLen) {
  if (!str) return '';
  str = str.trim().replace(/\s+/g, ' ');
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 3) + '...';
}

/**
 * Get element's CSS classes (cleaned).
 */
export function getElementClasses(element) {
  return selectorEngine.getCleanClasses(element);
}

/**
 * Get element's CSS path.
 */
export function getElementPath(element) {
  return selectorEngine.generate(element);
}

/**
 * Get full DOM path (forensic mode).
 */
export function getFullElementPath(element) {
  return selectorEngine.getFullPath(element);
}

/**
 * Get nearby text context.
 */
export function getNearbyText(element) {
  const parts = [];

  // Own text
  const ownText = element.textContent?.trim();
  if (ownText && ownText.length < 100) {
    parts.push(ownText);
  }

  // Previous sibling text
  const prev = element.previousElementSibling;
  if (prev) {
    const prevText = prev.textContent?.trim();
    if (prevText && prevText.length < 50) {
      parts.unshift(prevText);
    }
  }

  // Next sibling text
  const next = element.nextElementSibling;
  if (next) {
    const nextText = next.textContent?.trim();
    if (nextText && nextText.length < 50) {
      parts.push(nextText);
    }
  }

  return parts.join(' | ');
}

/**
 * Get nearby elements description.
 */
export function getNearbyElements(element) {
  const parent = element.parentElement;
  if (!parent) return '';

  const siblings = Array.from(parent.children)
    .filter(c => c !== element)
    .slice(0, 4)
    .map(c => identifyElement(c));

  if (siblings.length === 0) return '';

  return siblings.join(', ');
}

/**
 * Get accessibility information.
 */
export function getAccessibilityInfo(element) {
  const info = [];

  const role = element.getAttribute('role');
  if (role) info.push(`role="${role}"`);

  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel) info.push(`aria-label="${ariaLabel}"`);

  const ariaDescribedby = element.getAttribute('aria-describedby');
  if (ariaDescribedby) info.push(`aria-describedby="${ariaDescribedby}"`);

  const tabindex = element.getAttribute('tabindex');
  if (tabindex !== null) info.push(`tabindex="${tabindex}"`);

  const ariaHidden = element.getAttribute('aria-hidden');
  if (ariaHidden) info.push(`aria-hidden="${ariaHidden}"`);

  // Check focusability
  const focusable = element.matches(
    'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  if (focusable) info.push('focusable');

  return info.join(', ');
}

/**
 * Get key computed styles (for detailed/forensic modes).
 */
export function getComputedStyles(element) {
  const computed = window.getComputedStyle(element);
  const styles = {};

  // Colors
  styles.color = computed.color;
  styles.backgroundColor = computed.backgroundColor;

  // Typography
  styles.fontSize = computed.fontSize;
  styles.fontWeight = computed.fontWeight;
  styles.fontFamily = computed.fontFamily;

  // Layout
  styles.display = computed.display;
  styles.position = computed.position;

  // Box model
  styles.padding = computed.padding;
  styles.margin = computed.margin;

  return styles;
}

/**
 * Check if element has fixed/sticky positioning.
 */
export function isElementFixed(element) {
  let current = element;
  while (current && current !== document.body) {
    const position = window.getComputedStyle(current).position;
    if (position === 'fixed' || position === 'sticky') {
      return true;
    }
    current = current.parentElement;
  }
  return false;
}
