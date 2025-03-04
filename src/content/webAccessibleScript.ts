// webAccessibleScript.js
window.addEventListener("message", function (event) {
  if (event.data.type === "GET_ANGULAR_SCOPE") {
    const selector = event.data.selector;
    let result = null;

    try {
      if (typeof (window as any).angular !== "undefined") {
        const element = document.querySelector(selector);
        if (element) {
          const scope = (window as any).angular.element(element).scope();
          if (scope) {
            // Extract only serializable data
            result = {
              $id: scope.$id,
              $parent: scope.$parent ? scope.$parent.$id : null,
            };

            // If you need to extract more properties dynamically:
            const safeProps: any = {};
            Object.keys(scope).forEach(key => {
              try {
                const value = scope[key];
                // Skip Angular internal properties that start with $
                if (key.startsWith("$") && key !== "$id") {
                  return;
                }
                // Only include primitive values and try to serialize
                if (
                  value === null ||
                  typeof value === "undefined" ||
                  typeof value === "string" ||
                  typeof value === "number" ||
                  typeof value === "boolean"
                ) {
                  safeProps[key] = value;
                } else if (Array.isArray(value) || typeof value === "object") {
                  // Try to serialize to catch any issues
                  const serialized = JSON.stringify(value);
                  if (serialized) {
                    safeProps[key] = JSON.parse(serialized);
                  }
                }
              } catch (e) {
                // Skip properties that can't be serialized
                console.debug(`Skipping non-serializable property: ${key}`);
              }
            });

            result = {
              ...result,
              ...safeProps,
            };
          }
        }
      }
    } catch (error) {
      console.error("Error getting Angular scope:", error);
    }

    window.postMessage(
      {
        type: "ANGULAR_SCOPE",
        selector: selector,
        value: result,
      },
      "*"
    );
  }
  if (event.data.type === "SET_TINYMCE_CONTENT") {
    const content = event.data.content;
    const editorId = event.data.editorId;
    const tinymceEditor = (window as any).tinymce.get(editorId);
    const existingContent = tinymceEditor?.getContent?.() || "";
    const newContent = existingContent + (existingContent ? "\n\n" : "") + content;
    tinymceEditor?.setContent(newContent);
    window.postMessage(
      {
        type: "TINYMCE_CONTENT_SET",
      },
      "*"
    );
  }
  if (event.data.type === "LOG_ROCKET_INIT") {
    const ALLEVA_URL_PATTERNS = [
      "https://*.allevasoft.com/*",
      "https://*.allevasoft.io/*",
      "https://*.alleva.io/*",
    ];
    const isAllowedUrl = (url: string): boolean => {
      // Extract domain from URL
      const urlObj = new URL(url);
      const domain = urlObj.hostname;

      return ALLEVA_URL_PATTERNS.some(pattern => {
        // Convert wildcard pattern to regex pattern
        const patternDomain = new URL(pattern.replace("*.", "")).hostname.replace("*.", "");
        return domain.endsWith(patternDomain);
      });
    };
    const isAllevaUrl = isAllowedUrl(window.location.href);
    let logRocketInitOptions: any = {
      network: {
        isEnabled: false,
      },
      shouldDebugLog: false,
    };
    if (isAllevaUrl) {
      logRocketInitOptions = {
        ...logRocketInitOptions,
        rootHostname: "allevasoft.com",
        childDomains: ["*.allevasoft.com", "*.allevasoft.io", "*.alleva.io"],
        parentDomain: "allevasoft.com",
      };
    }
    (window as any)?.LogRocket?.init("kgns4k/facilitator-dashboard-prod", logRocketInitOptions);
  }
  if (event.data.type === "LOG_ROCKET_IDENTIFY") {
    (window as any)?.LogRocket?.identify(event.data.user?.userId, {
      ...(event.data?.user || {}),
    });
  }
  if (event.data.type === "ADD_LOG_ROCKET_LOG") {
    (window as any)?.LogRocket?.log(event.data.message, event.data.data);
  }
});
