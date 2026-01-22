/**
 * Output formatting for annotations.
 * Supports Markdown and JSON in 4 detail levels.
 */

/**
 * Format annotations for output.
 * @param {Array} annotations
 * @param {Object} options - { detail: 'compact'|'standard'|'detailed'|'forensic', format: 'markdown'|'json', route: string }
 * @returns {string}
 */
export function formatOutput(annotations, options = {}) {
  const { detail = 'standard', format = 'markdown', route = null } = options;

  if (format === 'json') {
    return formatJSON(annotations, detail, route);
  }

  return formatMarkdown(annotations, detail, route);
}

/**
 * Format as Markdown.
 */
function formatMarkdown(annotations, detail, route) {
  if (annotations.length === 0) {
    return '# No annotations\n\nNo elements have been annotated.';
  }

  // Compact mode - minimal output
  if (detail === 'compact') {
    return formatCompact(annotations);
  }

  const lines = [];

  // Header
  if (route) {
    lines.push(`## Page Feedback: ${route}`);
  } else {
    lines.push('## Page Feedback');
  }

  lines.push(`**Viewport:** ${window.innerWidth}x${window.innerHeight}`);

  // Forensic mode header extras
  if (detail === 'forensic') {
    lines.push(`**URL:** ${window.location.href}`);
    lines.push(`**User Agent:** ${navigator.userAgent}`);
    lines.push(`**Device Pixel Ratio:** ${window.devicePixelRatio}`);
  }

  lines.push('');

  // Annotations
  annotations.forEach((ann, i) => {
    lines.push(`### ${i + 1}. ${ann.element}`);
    lines.push('');

    // Standard fields
    if (detail === 'forensic' && ann.fullPath) {
      lines.push(`**Full DOM Path:** ${ann.fullPath}`);
    } else {
      lines.push(`**Location:** \`${ann.elementPath}\``);
    }

    // Detailed and forensic: classes
    if ((detail === 'detailed' || detail === 'forensic') && ann.cssClasses) {
      lines.push(`**Classes:** ${ann.cssClasses}`);
    }

    // Detailed and forensic: position
    if ((detail === 'detailed' || detail === 'forensic') && ann.boundingBox) {
      const bb = ann.boundingBox;
      if (detail === 'forensic') {
        lines.push(`**Position:** x:${bb.x}, y:${bb.y} (${bb.width}×${bb.height}px)`);
        lines.push(`**Annotation at:** ${ann.x.toFixed(1)}% from left, ${Math.round(ann.y)}px from top`);
      } else {
        lines.push(`**Position:** ${bb.x}px, ${bb.y}px (${bb.width}×${bb.height}px)`);
      }
    }

    // Selected text
    if (ann.selectedText) {
      lines.push(`**Selected text:** "${ann.selectedText}"`);
    }

    // Forensic: computed styles
    if (detail === 'forensic' && ann.computedStyles) {
      lines.push(`**Computed Styles:** ${ann.computedStyles}`);
    }

    // Forensic: accessibility
    if (detail === 'forensic' && ann.accessibility) {
      lines.push(`**Accessibility:** ${ann.accessibility}`);
    }

    // Detailed and forensic: nearby context
    if ((detail === 'detailed' || detail === 'forensic') && ann.nearbyText) {
      lines.push(`**Context:** "${ann.nearbyText}"`);
    }

    // Forensic: nearby elements
    if (detail === 'forensic' && ann.nearbyElements) {
      lines.push(`**Nearby Elements:** ${ann.nearbyElements}`);
    }

    // Feedback (always)
    lines.push(`**Feedback:** ${ann.comment || '(no feedback provided)'}`);
    lines.push('');
  });

  return lines.join('\n');
}

/**
 * Format compact mode - minimal output.
 */
function formatCompact(annotations) {
  return annotations
    .map((ann, i) => `${i + 1}. ${ann.element}: ${ann.comment || '(no feedback)'}`)
    .join('\n');
}

/**
 * Format as JSON.
 */
function formatJSON(annotations, detail, route) {
  const output = {
    route: route || window.location.pathname,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    annotations: annotations.map(ann => formatAnnotationJSON(ann, detail)),
  };

  // Forensic extras
  if (detail === 'forensic') {
    output.url = window.location.href;
    output.userAgent = navigator.userAgent;
    output.devicePixelRatio = window.devicePixelRatio;
    output.timestamp = Date.now();
  }

  return JSON.stringify(output, null, 2);
}

/**
 * Format single annotation for JSON.
 */
function formatAnnotationJSON(ann, detail) {
  const base = {
    element: ann.element,
    location: ann.elementPath,
    feedback: ann.comment || null,
  };

  if (ann.selectedText) {
    base.selectedText = ann.selectedText;
  }

  // Standard: add nothing extra

  // Detailed: add classes, position
  if (detail === 'detailed' || detail === 'forensic') {
    if (ann.cssClasses) {
      base.classes = ann.cssClasses.split(' ');
    }
    if (ann.boundingBox) {
      base.position = ann.boundingBox;
    }
    if (ann.nearbyText) {
      base.context = ann.nearbyText;
    }
  }

  // Forensic: add everything
  if (detail === 'forensic') {
    if (ann.fullPath) {
      base.fullDOMPath = ann.fullPath;
    }
    if (ann.computedStyles) {
      base.computedStyles = ann.computedStyles;
    }
    if (ann.accessibility) {
      base.accessibility = ann.accessibility;
    }
    if (ann.nearbyElements) {
      base.nearbyElements = ann.nearbyElements;
    }
    base.annotationPosition = {
      xPercent: ann.x,
      yPixels: ann.y,
    };
    base.timestamp = ann.timestamp;
    base.isFixed = ann.isFixed || false;
    base.isMultiSelect = ann.isMultiSelect || false;
  }

  return base;
}

/**
 * Copy text to clipboard.
 * @param {string} text
 * @returns {Promise<boolean>}
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    console.warn('Agentation: Clipboard write failed', e);
    // Fallback for older browsers
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return true;
    } catch {
      return false;
    }
  }
}
