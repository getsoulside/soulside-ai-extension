import { addIframe, findAndRemovePatientChartIframes } from "./iframeManager.js";
import { IFRAME_TYPES } from "./constants.js";

console.log("Soulside Extension Script Injected");

const rootObserver = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (node.tagName === "IFRAME" && node.src.includes(IFRAME_TYPES.PATIENT_CHART)) {
        addIframe(node, IFRAME_TYPES.PATIENT_CHART);
      }
    });

    mutation.removedNodes.forEach(node => {
      findAndRemovePatientChartIframes(node);
    });
  });
});

// Start observing the document
rootObserver.observe(document.body, { childList: true, subtree: true });

// Handle existing iframes
document.querySelectorAll("iframe").forEach(iframe => {
  if (iframe.src.includes(IFRAME_TYPES.PATIENT_CHART)) {
    addIframe(iframe, IFRAME_TYPES.PATIENT_CHART);
  }
});
