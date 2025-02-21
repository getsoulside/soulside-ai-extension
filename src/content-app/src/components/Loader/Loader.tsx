import React from "react";
import { Box, CircularProgress } from "@mui/material";

interface LoaderProps {
  loading: boolean;
  size?: string;
  children?: React.ReactNode;
}

const Loader: React.FC<LoaderProps> = ({ loading, size = "medium", children }): React.ReactNode => {
  if (!loading) return children;
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        height: "100%",
      }}
    >
      <CircularProgress size={size === "medium" ? 40 : size === "large" ? 60 : 20} />
    </Box>
  );
};

export default Loader;
