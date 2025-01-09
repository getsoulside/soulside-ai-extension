import React, { useRef, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { CacheProvider } from "@emotion/react";
import { Provider } from "react-redux";
import createCache from "@emotion/cache";
import { ToastContainer, Bounce } from "react-toastify";
import AppTheme from "./theme";
import { store } from "./store";

interface ShadowRootHostProps {
  children: React.ReactNode;
}

const ShadowRootHost: React.FC<ShadowRootHostProps> = ({ children }) => {
  const shadowHostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shadowHostRef.current) {
      // Attach Shadow DOM
      const shadowRoot = shadowHostRef.current.attachShadow({ mode: "open" });

      // Create a container for the React app
      const container = document.createElement("div");
      shadowRoot.appendChild(container);

      // Create Emotion cache for Shadow DOM
      const cache = createCache({
        key: "mui-shadow",
        container: shadowRoot,
      });

      // Render React App inside Shadow DOM
      ReactDOM.createRoot(container).render(
        <Provider store={store}>
          <CacheProvider value={cache}>
            <AppTheme>{children}</AppTheme>
          </CacheProvider>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={false}
            draggable
            pauseOnHover
            theme="light"
            transition={Bounce}
          />
        </Provider>
      );
    }
  }, []);

  return <div ref={shadowHostRef}></div>;
};

export default ShadowRootHost;
