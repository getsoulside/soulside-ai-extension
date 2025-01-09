import React from "react";
import { Typography } from "@mui/material";

import useErrorLayout from "./useErrorLayout";

import "./ErrorLayout.scss";

const ErrorLayout: React.FC = (): React.ReactNode => {
  const { error } = useErrorLayout();
  return (
    <div className="error-layout">
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
    </div>
  );
};

export default ErrorLayout;
