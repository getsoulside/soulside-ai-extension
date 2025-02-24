import React from "react";
import { Box, CircularProgress, LinearProgress, Typography } from "@mui/material";

interface LoaderProps {
  loading: boolean;
  size?: string;
  children?: React.ReactNode;
  loadingText?: string;
  progressLoader?: boolean;
}

const Loader: React.FC<LoaderProps> = ({
  loading,
  size = "medium",
  children,
  loadingText,
  progressLoader,
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
      {!progressLoader ? (
        <CircularProgress size={size === "medium" ? 40 : size === "large" ? 60 : 20} />
      ) : (
        <LinearProgress
          sx={{ width: "100%" }}
          color="primary"
        />
      )}
      {loadingText && (
        <Typography
          variant="subtitle2"
          align="center"
        >
          {loadingText}
        </Typography>
      )}
    </Box>
  );
};

export default Loader;
