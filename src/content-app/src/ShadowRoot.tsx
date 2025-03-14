import React, { useRef, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { CacheProvider } from "@emotion/react";
import { Provider } from "react-redux";
import createCache from "@emotion/cache";
import { ToastContainer, Bounce } from "react-toastify";
import AppTheme from "./theme";
import { store } from "./store";
import ReactToastifyStyles from "./theme/ReactToastifyStyles";
import ReactQuillStyles from "./theme/ReactQuillStyles";
interface ShadowRootHostProps {
  children: React.ReactNode;
}

const ShadowRootHost: React.FC<ShadowRootHostProps> = ({ children }) => {
  const shadowHostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!shadowHostRef.current) return;

    // Attach or retrieve Shadow DOM
    const shadowRoot =
      shadowHostRef.current.shadowRoot || shadowHostRef.current.attachShadow({ mode: "open" });

    shadowRoot.addEventListener(
      "keydown",
      (event: Event) => {
        const keyboardEvent = event as KeyboardEvent;
        if (keyboardEvent.key === "Backspace") {
          keyboardEvent.stopPropagation();
        }
      },
      true
    );

    //add styles from ./theme/ReactToastify.css to shadow root
    const styleEl = document.createElement("style");
    styleEl.innerHTML = ReactToastifyStyles;
    shadowRoot.appendChild(styleEl);

    const quillStyleEl = document.createElement("style");
    quillStyleEl.innerHTML = ReactQuillStyles;
    shadowRoot.appendChild(quillStyleEl);

    // Create or reuse container
    let container = shadowRoot.getElementById("soulside-shadow-root-container") as HTMLDivElement;
    if (!container) {
      container = document.createElement("div");
      container.id = "soulside-shadow-root-container";
      shadowRoot.appendChild(container);
    }

    // Create Emotion cache for Shadow DOM
    const cache = createCache({
      key: "mui-shadow",
      container: shadowRoot as unknown as HTMLElement,
    });

    // Render React App inside Shadow DOM
    let root = (container as any)._reactRootContainer;
    if (!root) {
      root = ReactDOM.createRoot(container);
      (container as any)._reactRootContainer = root;
    }
    root.render(
      <Provider store={store}>
        <CacheProvider value={cache}>
          <AppTheme shadowRoot={shadowRoot}>{children}</AppTheme>
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

    // Cleanup on unmount
    return () => {
      root.unmount();
    };
  }, []);

  return (
    <div
      ref={shadowHostRef}
      id="soulside-shadow-root-wrapper"
    ></div>
  );
};

export default ShadowRootHost;
