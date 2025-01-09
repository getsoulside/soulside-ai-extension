const injectReactApp = () => {
  const rootDivId = "soulside-extension-root";

  // Create a root div if it doesn't exist
  let rootDiv = document.getElementById(rootDivId);
  if (!rootDiv) {
    rootDiv = document.createElement("div");
    rootDiv.id = rootDivId;
    document.body.appendChild(rootDiv);
  }

  // Load React's main script
  const script = document.createElement("script");
  script.src = "http://localhost:5174/src/main.tsx";
  script.type = "module";
  script.async = true;
  document.body.appendChild(script);
};

// Inject the React app
injectReactApp();
