/**
 * Annotation data management.
 */

import {
  identifyElement,
  getElementPath,
  getFullElementPath,
  getElementClasses,
  getNearbyText,
  getNearbyElements,
  getAccessibilityInfo,
  getComputedStyles,
  isElementFixed,
} from './element-identification.js';
import { loadAnnotations, saveAnnotations, clearAnnotations as storageClear } from './storage.js';

let annotations = [];
let idCounter = 0;

/**
 * Initialize annotations from storage.
 */
export function initAnnotations() {
  annotations = loadAnnotations();
  // Set counter to max existing id + 1
  idCounter = annotations.reduce((max, a) => {
    const num = parseInt(a.id.split('-')[1] || '0', 10);
    return Math.max(max, num);
  }, 0) + 1;
}

/**
 * Create annotation for an element.
 * @param {Element} element
 * @param {string} comment - User feedback
 * @param {string} selectedText - User-selected text
 * @param {boolean} isMultiSelect - Part of multi-select
 * @returns {Object} Annotation object
 */
export function createAnnotation(element, comment, selectedText = '', isMultiSelect = false) {
  const rect = element.getBoundingClientRect();
  const scrollY = window.scrollY;
  const scrollX = window.scrollX;
  const isFixed = isElementFixed(element);

  const annotation = {
    id: `ann-${idCounter++}`,
    timestamp: Date.now(),

    // Position (percentage for x, pixels for y)
    x: ((rect.left + rect.width / 2) / window.innerWidth) * 100,
    y: isFixed ? rect.top + rect.height / 2 : rect.top + rect.height / 2 + scrollY,

    // Core data
    element: identifyElement(element),
    elementPath: getElementPath(element),
    comment: comment,

    // Optional data
    selectedText: selectedText ? selectedText.slice(0, 500) : undefined,
    boundingBox: {
      x: Math.round(rect.left + scrollX),
      y: Math.round(rect.top + scrollY),
      width: Math.round(rect.width),
      height: Math.round(rect.height),
    },

    // Extended data (for detailed/forensic modes)
    cssClasses: getElementClasses(element).join(' ') || undefined,
    nearbyText: getNearbyText(element) || undefined,
    nearbyElements: getNearbyElements(element) || undefined,
    fullPath: getFullElementPath(element),
    accessibility: getAccessibilityInfo(element) || undefined,
    computedStyles: formatComputedStyles(getComputedStyles(element)),

    // Flags
    isMultiSelect: isMultiSelect || undefined,
    isFixed: isFixed || undefined,
  };

  annotations.push(annotation);
  saveAnnotations(annotations);

  return annotation;
}

/**
 * Format computed styles as string.
 */
function formatComputedStyles(styles) {
  return Object.entries(styles)
    .filter(([, v]) => v && v !== 'none' && v !== 'normal' && v !== 'auto')
    .map(([k, v]) => `${k}: ${v}`)
    .join('; ');
}

/**
 * Get all annotations.
 */
export function getAnnotations() {
  return [...annotations];
}

/**
 * Remove annotation by ID.
 */
export function removeAnnotation(id) {
  annotations = annotations.filter(a => a.id !== id);
  saveAnnotations(annotations);
}

/**
 * Clear all annotations.
 */
export function clearAllAnnotations() {
  annotations = [];
  storageClear();
}

/**
 * Get annotation count.
 */
export function getAnnotationCount() {
  return annotations.length;
}
