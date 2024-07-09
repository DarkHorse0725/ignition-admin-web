import { Box } from "@mui/material";
import React, { ReactNode } from "react";

export const DialogIcon = ({ children }: { children: ReactNode }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        mb: "20px",
      }}
    >
      {children}
    </Box>
  );
};
