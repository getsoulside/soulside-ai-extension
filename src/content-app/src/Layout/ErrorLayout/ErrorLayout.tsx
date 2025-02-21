import React from "react";
import { Box, Typography } from "@mui/material";

import useErrorLayout from "./useErrorLayout";

const ErrorLayout: React.FC = (): React.ReactNode => {
  const { error } = useErrorLayout();
  return (
    <Box
      className="error-layout"
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography
        variant="h1"
        color="error"
      >
        Oops!
      </Typography>
      <Typography
        variant="h6"
        sx={{ marginTop: "15px" }}
      >
        Sorry, an unexpected error has occurred.
      </Typography>
      <Typography
        variant="h6"
        sx={{ marginTop: "15px" }}
      >
        {(error as any).statusText || (error as any).message}
      </Typography>
    </Box>
  );
};

export default ErrorLayout;
