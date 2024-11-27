import { addIframe, removeIframe, trackParentChildRelationship } from "./iframeManager.js";
import { IFRAME_TYPES, CHIEF_COMPLAINT_FIELD_ID } from "./constants.js";
import { fetchSessionNotes } from "./fetchNotes.js";

const elemSelectors = [
  `textarea[name="${CHIEF_COMPLAINT_FIELD_ID}"]`,
  'input[name="hidParentID"]',
  'input[name="hidTemplateName"]',
];

const observers = new Map(); // Track MutationObservers

export const setupNotesEventListener = (doc, selector, callback) => {
  const element = doc.querySelector(selector);
  if (element) {
    fetchSessionNotes(doc);
    if (selector.includes("input")) {
      const observer = new MutationObserver(mutationsList => {
        mutationsList.forEach(mutation => {
          if (mutation.attributeName === "value") {
            callback({ target: { value: element.value } });
          }
        });
      });

      // Observe the input element for attribute changes
      observer.observe(element, { attributes: true });
    }
  }
};

// Utility to set up event listeners for specific elements
const setupEventListeners = (iframeDoc, selectors) => {
  selectors.forEach(selector => {
    setupNotesEventListener(iframeDoc, selector, event => {
      fetchSessionNotes(iframeDoc);
    });
  });
};

// Handle added nodes in the iframe
const handleAddedNodes = (iframeDoc, nodes, type) => {
  nodes.forEach(node => {
    if (type === IFRAME_TYPES.CHART_NOTES) {
      if (node.tagName === "TEXTAREA" && node.name === CHIEF_COMPLAINT_FIELD_ID) {
        setupNotesEventListener(
          iframeDoc,
          `textarea[name="${CHIEF_COMPLAINT_FIELD_ID}"]`,
          event => {
            fetchSessionNotes(iframeDoc);
          }
        );
      } else if (node.tagName === "INPUT" && node.name === "hidParentID") {
        setupNotesEventListener(iframeDoc, 'input[name="hidParentID"]', event => {
          fetchSessionNotes(iframeDoc);
        });
      } else if (node.tagName === "INPUT" && node.name === "hidTemplateName") {
        setupNotesEventListener(iframeDoc, 'input[name="hidTemplateName"]', event => {
          fetchSessionNotes(iframeDoc);
        });
      }
    }
    if (node.tagName === "IFRAME") {
      const srcType = Object.values(IFRAME_TYPES).find(type => node.src.includes(type));
      if (srcType) {
        addIframe(node, srcType);
        trackParentChildRelationship(node, iframeDoc.defaultView.frameElement);
      }
    }
  });
};

// Set up MutationObserver
const setupMutationObserver = (iframe, iframeDoc, type) => {
  const observer = new MutationObserver(mutations => {
    mutations.forEach(({ addedNodes, removedNodes }) => {
      handleAddedNodes(iframeDoc, addedNodes, type);

      removedNodes.forEach(node => {
        if (node.tagName === "IFRAME") removeIframe(node);
      });
    });
  });

  if (!observers.has(iframe)) {
    observer.observe(iframeDoc.body, { childList: true, subtree: true });
    observers.set(iframe, observer);
  }
};

// Observe iframe for changes
export const observeIframe = (iframe, type) => {
  const onIframeLoad = () => {
    try {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

      if (!iframeDoc) return;

      if (type === IFRAME_TYPES.CHART_NOTES) {
        setupEventListeners(iframeDoc, elemSelectors);
      }

      if (type === IFRAME_TYPES.CHART_VIEWER_DETAIL) {
        iframeDoc.querySelectorAll("iframe").forEach(nestedIframe => {
          if (nestedIframe.src.includes(IFRAME_TYPES.CHART_NOTES)) {
            addIframe(nestedIframe, IFRAME_TYPES.CHART_NOTES);
            trackParentChildRelationship(nestedIframe, iframe);
          }
        });
      }

      setupMutationObserver(iframe, iframeDoc, type);
    } catch (error) {
      console.warn("Error accessing iframe content:", error);
    }
  };

  if (iframe.contentDocument) {
    onIframeLoad(); // Handle iframe that's already loaded
  }

  iframe.addEventListener("load", onIframeLoad);
};

// Disconnect and clean up observers
export const disconnectObservers = iframe => {
  const observer = observers.get(iframe);
  if (observer) {
    observer.disconnect();
    observers.delete(iframe);
  }
};
