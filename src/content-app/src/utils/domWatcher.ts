/**
 * DOMWatcher class provides functionality to watch for DOM changes and execute logic in response.
 *
 * It uses MutationObserver to monitor DOM changes and can:
 * 1. Watch multiple logic functions that execute when DOM changes
 * 2. Handle both regular document and frameset scenarios
 * 3. Implements debouncing to avoid excessive executions
 */
export abstract class DOMWatcher {
  // Array to store watcher logic functions that will be executed on DOM changes
  public static watcherLogics: Array<() => void> = [];

  // Flag to track if the forced trigger timeout is active
  static lastTriggerTimeout: boolean;

  // Maximum time between forced triggers (2 seconds)
  static OBSERVER_TRIGGER_TIMEOUT: number = 2 * 1000;

  /**
   * Add a new watcher logic function to be executed on DOM changes
   */
  public static addLogic(watcherLogic: () => void) {
    DOMWatcher.watcherLogics.push(watcherLogic);
  }

  /**
   * Start observing DOM changes on the target document
   * @param targetDoc Optional document to observe. Defaults to top window document
   */
  public static startObserver(targetDoc?: Document) {
    // Configure and create observer for a target node
    const configObserver = (targetNode: Node) => {
      // Configuration for what mutations to observe
      const config: MutationObserverInit = {
        attributeFilter: ["style", "hidden", "trigger"], // Only watch specific attributes
        childList: true, // Watch for changes in child elements
        subtree: true, // Watch all descendants
        characterData: true, // Watch for text content changes
      };

      // Debounce timer
      let timer: NodeJS.Timeout;

      // Callback executed when mutations occur
      const callback = () => {
        // Clear existing timer if not in forced trigger mode
        if (timer && !this.lastTriggerTimeout) {
          clearTimeout(timer);
        }

        // Set new timer to execute logic after 750ms of no changes
        timer = setTimeout(() => {
          this.lastTriggerTimeout = false;
          DOMWatcher.watcherLogics.forEach(watcherLogic => watcherLogic());
        }, 750);
      };

      // Create and start the observer
      const observer = new MutationObserver(callback);
      observer.observe(targetNode, config);
    };

    // Get the target document (provided or top window)
    const topDoc = targetDoc || window.top?.document;

    // Special handling for framesets
    if (typeof window.jQuery !== "undefined" && window.jQuery("frameset").length) {
      const specialCaseDoc = window.top;
      if (!specialCaseDoc) return;

      // Observe each frame's document body
      const frames = Array.from(specialCaseDoc.frames);
      frames.forEach(frame => {
        if (frame.document?.body) {
          configObserver(frame.document.body);
        }
      });

      // Force trigger the observer periodically for constantly updating pages
      setInterval(() => {
        this.lastTriggerTimeout = true;
      }, this.OBSERVER_TRIGGER_TIMEOUT);
    } else {
      // Regular case - observe the main document body
      if (topDoc?.body) {
        configObserver(topDoc.body);
      }
    }
  }

  public static createDOMWatcher({
    targetNode,
    config,
    onNodeAdded,
    onNodeRemoved,
  }: {
    targetNode: Node;
    config: MutationObserverInit;
    onNodeAdded?: (node: Node) => void;
    onNodeRemoved?: (node: Node) => void;
  }) {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => onNodeAdded?.(node));
        mutation.removedNodes.forEach(node => onNodeRemoved?.(node));
      });
    });

    observer.observe(targetNode, config);
    return observer;
  }
}
