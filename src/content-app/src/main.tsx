import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const rootDivId = "soulside-extension-root";

// Create a root div if it doesn't exist
let rootDiv = document.getElementById(rootDivId);
if (!rootDiv) {
  rootDiv = document.createElement("div");
  rootDiv.id = rootDivId;
  document.body.appendChild(rootDiv);
}

createRoot(rootDiv!).render(<App />);
