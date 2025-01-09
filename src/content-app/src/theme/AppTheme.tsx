import * as React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
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
}

export default function AppTheme(props: AppThemeProps) {
  const { children } = props;
  const theme = React.useMemo(() => {
    return createTheme({
      cssVariables: {
        disableCssColorScheme: true,
        cssVarPrefix: "soulside",
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
      },
    });
  }, []);
  return (
    <ThemeProvider
      theme={theme}
      disableTransitionOnChange
    >
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
