export const setupNotesEventListener = (doc, selector, callback) => {
  const element = doc.querySelector(selector);
  if (element) {
    element.removeEventListener("input", callback);
    element.addEventListener("input", callback);
  }
};
