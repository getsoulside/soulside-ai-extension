import React, { useEffect, useMemo } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { StylesProvider } from "@mui/styles";
import {
  inputsCustomizations,
  dataDisplayCustomizations,
  feedbackCustomizations,
  navigationCustomizations,
  surfacesCustomizations,
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
} from "./customizations";
import { getDesignTokens } from "./themePrimitives";

interface AppThemeProps {
  children: React.ReactNode;
  shadowRoot: ShadowRoot | null;
}

const generateCssVariables = (obj: Record<string, any>, prefix = "soulside-extension"): string => {
  const cssVariables = Object.entries(obj)
    .flatMap(([key, value]) => {
      if (typeof key === "symbol" || typeof value === "symbol") {
        return []; // Skip this entry
      }

      if (key === "shadows") {
        // Handle array-like properties, such as shadows
        return value.map((item: string, index: number) => `--${prefix}-${key}-${index}: ${item};`);
      }

      if (typeof value === "function") {
        if (key === "spacing") {
          // Add predefined spacing values
          return Array.from(
            { length: 10 },
            (_, index) => `--${prefix}-${key}-${index}: ${value(index)};`
          ).concat([`--${prefix}-${key}: 8px;`]);
        }
        return [];
      }

      if (value && typeof value === "object" && !Array.isArray(value)) {
        return generateCssVariables(value, `${prefix}-${key}`);
      }

      return `--${prefix}-${key}: ${value};`;
    })
    .join("\n");

  return cssVariables;
};

export default function AppTheme(props: AppThemeProps) {
  const { children } = props;
  const theme = useMemo(() => {
    return createTheme({
      cssVariables: {
        disableCssColorScheme: true,
        cssVarPrefix: "soulside-extension",
      },
      ...getDesignTokens("light"),
      components: {
        ...inputsCustomizations,
        ...dataDisplayCustomizations,
        ...feedbackCustomizations,
        ...navigationCustomizations,
        ...surfacesCustomizations,
        ...chartsCustomizations,
        ...dataGridCustomizations,
        ...datePickersCustomizations,
        MuiPopper: {
          defaultProps: {
            container: () =>
              props.shadowRoot?.getElementById("soulside-extension-app") as Element | null,
          },
        },
        MuiPopover: {
          defaultProps: {
            container: () =>
              props.shadowRoot?.getElementById("soulside-extension-app") as Element | null,
          },
        },
        MuiDialog: {
          defaultProps: {
            container: () =>
              props.shadowRoot?.getElementById("soulside-extension-app") as Element | null,
          },
        },
      },
    });
  }, []);
  useEffect(() => {
    if (props.shadowRoot) {
      const style = document.createElement("style");
      const cssVariables = generateCssVariables(theme);
      style.textContent = `
        #soulside-extension-app {
          ${cssVariables}
          /* Add other CSS variables as needed */
        }
      `;
      props.shadowRoot.appendChild(style);
    }
  }, [props.shadowRoot, theme]);
  return (
    <ThemeProvider
      theme={theme}
      disableTransitionOnChange
    >
      <StylesProvider injectFirst>
        <CssBaseline />
        {children}
      </StylesProvider>
    </ThemeProvider>
  );
}
