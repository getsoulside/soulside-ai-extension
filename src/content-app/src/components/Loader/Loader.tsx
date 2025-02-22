import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

interface LoaderProps {
  loading: boolean;
  size?: string;
  children?: React.ReactNode;
  loadingText?: string;
}

const Loader: React.FC<LoaderProps> = ({
  loading,
  size = "medium",
  children,
  loadingText,
}): React.ReactNode => {
  if (!loading) return children;
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        flex: 1,
        gap: 1,
        height: "100%",
      }}
    >
      <CircularProgress size={size === "medium" ? 40 : size === "large" ? 60 : 20} />
      {loadingText && <Typography variant="subtitle2">{loadingText}</Typography>}
    </Box>
  );
};

export default Loader;
