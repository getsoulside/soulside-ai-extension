import { observeIframe } from "./observerUtils.js";
import { IFRAME_TYPES } from "./constants.js";

const iframeHierarchy = new Map();
const trackedIframes = new Map(); // Map for all tracked iframes by type

export const addIframe = (iframe, type) => {
  if (!iframe.src.includes(type) || trackedIframes.has(iframe)) return;

  // Track iframe and start observation
  trackedIframes.set(iframe, type);

  observeIframe(iframe, type);
};

export const removeIframe = iframe => {
  if (!trackedIframes.has(iframe)) return;

  // Disconnect observers
  disconnectObservers(iframe);

  // Remove from parent-child tracking
  for (const [child, parent] of iframeHierarchy.entries()) {
    if (parent === iframe) removeIframe(child);
  }
  iframeHierarchy.delete(iframe);
  // Remove from tracked list
  trackedIframes.delete(iframe);
};

export const trackParentChildRelationship = (childIframe, parentIframe) => {
  iframeHierarchy.set(childIframe, parentIframe);
};

export const findAndRemovePatientChartIframes = node => {
  // If the node itself is the iframe
  if (node.tagName === "IFRAME" && node.src.includes("/apps/amds-patient-chart/")) {
    removeIframe(node);
    return;
  }

  // If the node is a container, recursively check its children
  if (node.nodeType === 1 && node.childNodes.length > 0) {
    node.querySelectorAll("iframe").forEach(childIframe => {
      if (childIframe.src.includes("/apps/amds-patient-chart/")) {
        removeIframe(childIframe);
      }
    });
  }
};
